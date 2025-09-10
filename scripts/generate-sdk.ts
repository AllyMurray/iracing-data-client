#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";
import { quicktype, InputData, JSONSchemaInput, TypeScriptTargetLanguage } from "quicktype-core";
import { toPascal, toCamelCase, toKebab } from "./generate-sdk/utils";
import { type Root, type Flat, isEndpoint } from "./generate-sdk/types";

/** ---- CLI args ---- */
const INPUT = process.argv[2] ?? "docs/api/index.json";
const OUT_DIR = process.argv[3] ?? "src";
const SAMPLES_DIR = process.argv[4] ?? "samples";

const index: Root = JSON.parse(fs.readFileSync(INPUT, "utf8"));

function flatten(root: Root): Flat[] {
  const out: Flat[] = [];
  for (const [sectionName, section] of Object.entries(root)) {
    for (const [key, val] of Object.entries(section)) {
      if (isEndpoint(val)) {
        out.push(mk(sectionName, key, val));
      } else if (val && typeof val === "object") {
        for (const [k2, v2] of Object.entries(val)) {
          if (isEndpoint(v2)) out.push(mk(sectionName, `${key}.${k2}`, v2));
        }
      }
    }
  }
  return out;

  function mk(section: string, name: string, ep: Endpoint): Flat {
    const base = `${section}.${name}`;
    const method = toCamelCase(base.replace(/[^\w]/g, "_"));
    const sampleFile = `${SAMPLES_DIR}/${base}.json`;
    return {
      section,
      name,
      method,
      url: ep.link,
      params: ep.parameters || {},
      samplePath: fs.existsSync(sampleFile) ? sampleFile : undefined,
      responseType: fs.existsSync(sampleFile) ? `${toPascal(base.replace(/[^\w]/g, "_"))}Response` : undefined,
    };
  }
}


/** ---- Generate TypeScript types from JSON sample using quicktype ---- */
async function generateTypesFromSample(samplePath: string, typeName: string): Promise<string | null> {
  try {
    const sampleData = JSON.parse(fs.readFileSync(samplePath, "utf8"));

    // Check if this is a CSV response wrapper (sample data has underscore, client transforms to camelCase)
    if (sampleData._contentType === "csv") {
      // For CSV responses, return transformed property names (client converts snake_case to camelCase)
      return `export interface ${typeName} {
  ContentType: "csv";
  RawData: string;
  Note: string;
}`;
    }

    // Use quicktype properly
    const jsonInput = new InputData();
    const jsonString = JSON.stringify(sampleData);

    // Add the JSON source properly
    await jsonInput.addSource("json", {
      name: typeName,
      samples: [jsonString],
    }, () => undefined as any);

    const result = await quicktype({
      inputData: jsonInput,
      lang: "typescript",
      rendererOptions: {
        "just-types": true,
        "nice-property-names": true,
        "prefer-unions": true,
        "explicit-unions": true,
      },
    });

    // Process the generated code
    let typeCode = result.lines.join("\n");

    // Remove converter functions and clean up
    typeCode = typeCode
      .split("\n")
      .filter(line => !line.includes("Convert") && !line.includes("convert"))
      .join("\n");

    // Ensure the main interface uses our desired name
    if (!typeCode.includes(`export interface ${typeName}`)) {
      typeCode = typeCode.replace(/export interface \w+/, `export interface ${typeName}`);
    }

    return typeCode;
  } catch (error) {
    console.error(`Failed to generate types for ${samplePath}: ${error}`);
    // Fall back to simple generation
    try {
      const sampleData = JSON.parse(fs.readFileSync(samplePath, "utf8"));
      return generateTypeFromJson(sampleData, typeName);
    } catch {
      return null;
    }
  }
}

/** ---- Generate TypeScript interface from JSON object ---- */
function generateTypeFromJson(obj: any, typeName: string, indent: string = ""): string {
  const lines: string[] = [];

  if (Array.isArray(obj)) {
    // Handle arrays
    if (obj.length > 0) {
      const firstItem = obj[0];
      if (typeof firstItem === "object" && firstItem !== null) {
        // Array of objects - generate interface for the item
        const itemTypeName = typeName.replace(/Response$/, "") + "Item";
        const itemType = generateTypeFromJson(firstItem, itemTypeName, "");
        return `${itemType}\n\nexport type ${typeName} = Array<${itemTypeName}>;`;
      } else {
        // Array of primitives
        const itemType = getTypeForValue(firstItem);
        return `export type ${typeName} = Array<${itemType}>;`;
      }
    }
    return `export type ${typeName} = Array<any>;`;
  }

  // Check if it's a dictionary (object with numeric or similar keys)
  const keys = Object.keys(obj);
  if (keys.length > 0 && keys.every(k => /^\d+$/.test(k))) {
    // It's a dictionary with numeric keys
    const firstValue = obj[keys[0]];
    if (typeof firstValue === "object" && firstValue !== null) {
      const itemTypeName = typeName.replace(/Response$/, "") + "Item";
      const itemType = generateTypeFromJson(firstValue, itemTypeName, "");
      return `${itemType}\n\nexport interface ${typeName} {
  [key: string]: ${itemTypeName};
}`;
    }
  }

  // Regular object - generate interface
  lines.push(`export interface ${typeName} {`);

  for (const [key, value] of Object.entries(obj)) {
    const propName = toCamelCase(key);
    let typeStr = getTypeForValue(value);

    // Handle actual null/undefined/empty values from sample data
    let isOptional = false;
    if (value === null || value === undefined || value === "") {
      if (typeStr === "null") {
        typeStr = "string | null";
        isOptional = true;
      } else if (typeStr === "string" && value === "") {
        typeStr = "string | null";
        isOptional = true;
      } else {
        typeStr = `${typeStr} | null`;
        isOptional = true;
      }
    }

    const optionalMarker = isOptional ? "?" : "";
    if (propName !== key) {
      lines.push(`  ${propName}${optionalMarker}: ${typeStr}; // maps from: ${key}`);
    } else {
      lines.push(`  ${propName}${optionalMarker}: ${typeStr};`);
    }
  }

  lines.push(`}`);
  return lines.join("\n");
}

/** ---- Generate Zod schema from JSON sample ---- */
function generateZodSchemaFromSample(sample: any, schemaName: string): string {
  function getZodTypeForValue(value: any, depth: number = 0): string {
    if (value === null) return "z.null()";
    if (value === undefined) return "z.undefined()";

    const type = typeof value;

    switch (type) {
      case "string":
        // For specific string literals like "csv", use z.literal
        if (value === "csv") {
          return 'z.literal("csv")';
        }
        return "z.string()";
      case "number":
        return "z.number()";
      case "boolean":
        return "z.boolean()";
      case "object":
        if (Array.isArray(value)) {
          if (value.length > 0) {
            // Check if this is an array of objects that should be merged
            if (value.every(item => item && typeof item === 'object' && !Array.isArray(item))) {
              // Recursively merge array items to detect nullable/optional fields
              const mergedSchema = mergeArrayOfObjects(value, depth);
              return `z.array(${mergedSchema})`;
            }
            // For non-object arrays, use first item
            const itemType = getZodTypeForValue(value[0], depth);
            return `z.array(${itemType})`;
          }
          return "z.array(z.unknown())";
        }
        // For objects, generate a proper object schema
        return generateZodObjectSchema(value, depth);
      default:
        return "z.unknown()";
    }
  }

  function mergeArrayOfObjects(items: any[], depth: number = 0): string {
    // Merge all objects in the array to detect field variations
    const mergedObject: any = {};
    const fieldValues: Record<string, Set<any>> = {};
    const fieldCounts: Record<string, number> = {};
    const nestedObjects: Record<string, any[]> = {};
    const nestedArrays: Record<string, any[]> = {};
    
    for (const item of items) {
      for (const [fieldKey, fieldValue] of Object.entries(item)) {
        // Track ALL values including null for proper counting
        if (!(fieldKey in fieldValues)) {
          fieldValues[fieldKey] = new Set();
        }
        fieldValues[fieldKey].add(fieldValue);
        fieldCounts[fieldKey] = (fieldCounts[fieldKey] || 0) + 1;
        
        // Collect nested objects for recursive merging (including nulls)
        if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
          if (!(fieldKey in nestedObjects)) {
            nestedObjects[fieldKey] = [];
          }
          nestedObjects[fieldKey].push(fieldValue);  // This includes null values
        }
        // Collect nested arrays for recursive merging
        else if (Array.isArray(fieldValue)) {
          if (!(fieldKey in nestedArrays)) {
            nestedArrays[fieldKey] = [];
          }
          nestedArrays[fieldKey] = nestedArrays[fieldKey].concat(fieldValue);
        }
        
        // Store first non-null value as base
        if (!(fieldKey in mergedObject) || mergedObject[fieldKey] === null) {
          mergedObject[fieldKey] = fieldValue;
        }
      }
    }
    
    const totalObjects = items.length;
    
    // Process nested objects recursively
    for (const [fieldKey, objects] of Object.entries(nestedObjects)) {
      // Filter out null values for merging, but track if nulls exist
      const nonNullObjects = objects.filter(obj => obj !== null);
      const hasNulls = objects.some(obj => obj === null);
      
      if (nonNullObjects.length > 0) {
        // Recursively merge non-null nested objects
        const mergedNestedSchema = mergeArrayOfObjects(nonNullObjects, depth + 1);
        // Store the merged schema (it will be processed by getZodTypeForValue)
        mergedObject[fieldKey] = { __mergedSchema: mergedNestedSchema };
        
        // If some objects were null, mark the field as nullable
        if (hasNulls) {
          mergedObject[`__nullable_${fieldKey}`] = true;
        }
      } else if (hasNulls) {
        // All nested objects are null
        mergedObject[fieldKey] = null;
        mergedObject[`__nullable_${fieldKey}`] = true;
      }
    }
    
    // Store field values for later type inference
    mergedObject.__fieldValues = fieldValues;
    
    // Process nested arrays recursively
    for (const [fieldKey, allItems] of Object.entries(nestedArrays)) {
      if (allItems.length > 0 && allItems.every(item => item && typeof item === 'object' && !Array.isArray(item))) {
        // Recursively merge nested array items
        const mergedNestedSchema = mergeArrayOfObjects(allItems, depth + 1);
        mergedObject[fieldKey] = { __mergedArraySchema: mergedNestedSchema };
      }
    }
    
    // Mark fields as nullable or optional based on analysis
    for (const [fieldKey, valueSet] of Object.entries(fieldValues)) {
      const hasNull = valueSet.has(null);
      const hasNonNull = Array.from(valueSet).some(v => v !== null);
      const fieldCount = fieldCounts[fieldKey] || 0;
      
      if (hasNull && hasNonNull) {
        mergedObject[`__nullable_${fieldKey}`] = true;
      }
      if (fieldCount < totalObjects) {
        mergedObject[`__optional_${fieldKey}`] = true;
      }
    }
    
    return generateZodObjectSchema(mergedObject, depth);
  }

  function generateZodObjectSchema(obj: any, depth: number = 0): string {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return "z.unknown()";
    }
    
    // Check for special dictionary marker
    if ('__dictionary_unknown' in obj && obj.__dictionary_unknown === true) {
      return 'z.record(z.string(), z.unknown())';
    }

    const indent = '  '.repeat(depth + 1);
    const objIndent = '  '.repeat(depth);

    // Check for known object patterns and return specific schemas
    const keys = Object.keys(obj).filter(k => !k.startsWith('__'));

    // Track map layers structure
    if (keys.includes("background") && keys.includes("inactive") && keys.includes("active") && keys.includes("pitroad")) {
      return `z.object({
${indent}background: z.string(),
${indent}inactive: z.string(),
${indent}active: z.string(),
${indent}pitroad: z.string(),
${indent}startFinish: z.string(),
${indent}turns: z.string()
${objIndent}})`;
    }

    // Car type structure
    if (keys.includes("car_type") && keys.length === 1) {
      return `z.object({
${indent}carType: z.string()
${objIndent}})`;
    }

    // Cars in class structure (only for simple objects with exactly these 4 keys)
    if (keys.includes("car_dirpath") && keys.includes("car_id") && keys.includes("rain_enabled") && keys.includes("retired") && keys.length === 4) {
      return `z.object({
${indent}carDirpath: z.string(),
${indent}carId: z.number(),
${indent}rainEnabled: z.boolean(),
${indent}retired: z.boolean()
${objIndent}})`;
    }

    // Check if this looks like an ID mapping object (all keys are numeric strings)
    const objKeys = Object.keys(obj);
    const allKeysNumeric = objKeys.length > 0 && objKeys.every(key => /^\d+$/.test(key));

    if (allKeysNumeric && objKeys.length > 0) {
      const allValues = Object.values(obj);
      
      // If all values are primitives (numbers, strings, booleans), use simple record
      if (allValues.every(v => typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean')) {
        const firstValue = allValues[0];
        const valueType = getZodTypeForValue(firstValue, depth + 1);
        return `z.record(z.string(), ${valueType})`;
      }
      
      // For complex objects, merge all values to detect nullable fields
      if (allValues.every(v => v && typeof v === 'object' && !Array.isArray(v))) {
        // Merge all objects to detect field variations
        const mergedObject: any = {};
        const fieldValues: Record<string, Set<any>> = {};
        
        // Collect all field values to detect variations
        for (const value of allValues) {
          for (const [fieldKey, fieldValue] of Object.entries(value as any)) {
            if (!(fieldKey in mergedObject)) {
              mergedObject[fieldKey] = fieldValue;
            }
            if (!(fieldKey in fieldValues)) {
              fieldValues[fieldKey] = new Set();
            }
            fieldValues[fieldKey].add(fieldValue);
          }
        }
        
        // Mark fields as nullable if they have both null and non-null values
        // Mark fields as optional if they don't exist in all objects
        const totalObjects = allValues.length;
        const fieldCounts: Record<string, number> = {};
        
        // Count how many objects have each field
        for (const value of allValues) {
          for (const fieldKey of Object.keys(value as any)) {
            fieldCounts[fieldKey] = (fieldCounts[fieldKey] || 0) + 1;
          }
        }
        
        for (const [fieldKey, valueSet] of Object.entries(fieldValues)) {
          const hasNull = valueSet.has(null);
          const hasNonNull = Array.from(valueSet).some(v => v !== null);
          const fieldCount = fieldCounts[fieldKey] || 0;
          
          if (hasNull && hasNonNull) {
            mergedObject[`__nullable_${fieldKey}`] = true;
          }
          
          // If field doesn't exist in all objects, mark as optional
          if (fieldCount < totalObjects) {
            mergedObject[`__optional_${fieldKey}`] = true;
          }
        }
        
        const valueType = generateZodObjectSchema(mergedObject, depth + 1);
        return `z.record(z.string(), ${valueType})`;
      }
      
      // Fallback for mixed/unknown types
      const firstValue = allValues[0];
      const valueType = getZodTypeForValue(firstValue, depth + 1);
      return `z.record(z.string(), ${valueType})`;
    }

    // Generic object schema generation for everything else
    const properties: string[] = [];
    const fieldValues = obj.__fieldValues || {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip nullable and optional markers and internal data
      if (key.startsWith('__nullable_') || key.startsWith('__optional_') || key === '__fieldValues') {
        continue;
      }

      // CSV properties need special handling - client transforms _contentType -> ContentType
      let camelKey = toCamelCase(key);
      if (key === '_contentType' && value === 'csv') {
        camelKey = 'ContentType';
      } else if (key === '_rawData' && typeof value === 'string') {
        camelKey = 'RawData';
      } else if (key === '_note' && typeof value === 'string') {
        camelKey = 'Note';
      }

      // Handle special merged schema markers
      let zodType: string;
      if (value && typeof value === 'object' && '__mergedSchema' in value) {
        zodType = value.__mergedSchema;
      } else if (value && typeof value === 'object' && '__mergedArraySchema' in value) {
        zodType = `z.array(${value.__mergedArraySchema})`;
      } else {
        zodType = getZodTypeForValue(value, depth + 1);
      }

      // Check if this field was marked as nullable from sample merging
      const nullableMarker = `__nullable_${key}`;
      const optionalMarker = `__optional_${key}`;
      
      if (obj[nullableMarker] === true) {
        // This field can be null based on sample variations
        if (zodType === "z.null()") {
          // We need to find the actual type from the non-null values
          const nonNullValues = Array.from(fieldValues[key] || []).filter(v => v !== null);
          if (nonNullValues.length > 0) {
            const actualType = getZodTypeForValue(nonNullValues[0], depth + 1);
            zodType = `z.nullable(${actualType})`;
          } else {
            // All values are null, default to nullable string
            zodType = "z.nullable(z.string())";
          }
        } else {
          zodType = `z.nullable(${zodType})`;
        }
      } else if (value === null) {
        // Field is null - determine the type from field name patterns
        // Common patterns for numeric IDs
        if (key.endsWith('_id') || key.endsWith('Id') || 
            key === 'package_id' || key === 'packageId') {
          zodType = "z.nullable(z.number())";
        } else {
          // Default to nullable unknown for other null fields
          zodType = "z.nullable(z.unknown())";
        }
      } else if (value === undefined) {
        zodType = `z.optional(${zodType})`;
      } else if (value === "") {
        // Empty strings might indicate optional fields that can be null
        zodType = "z.nullable(z.string())";
      }
      
      // Check if this field was marked as optional (doesn't exist in all objects)
      if (obj[optionalMarker] === true) {
        zodType = `z.optional(${zodType})`;
      }

      properties.push(`${indent}${camelKey}: ${zodType}`);
    }

    return `z.object({\n${properties.join(',\n')}\n${objIndent}})`;
  }

  if (Array.isArray(sample)) {
    if (sample.length > 0) {
      // For arrays of objects, merge all items to detect nullable and optional fields
      if (sample.every(item => item && typeof item === 'object' && !Array.isArray(item))) {
        const mergedObject: any = {};
        const fieldValues: Record<string, Set<any>> = {};
        const fieldCounts: Record<string, number> = {};
        
        // Collect all field values and count occurrences
        // Also collect all variations of dictionary-like fields
        const dictionaryVariations: Record<string, any[]> = {};
        const nestedArrays: Record<string, any[]> = {};
        const nestedObjects: Record<string, any[]> = {};
        
        for (const item of sample) {
          for (const [fieldKey, fieldValue] of Object.entries(item as any)) {
            // Track ALL values including null for proper counting
            if (!(fieldKey in fieldValues)) {
              fieldValues[fieldKey] = new Set();
            }
            fieldValues[fieldKey].add(fieldValue);
            fieldCounts[fieldKey] = (fieldCounts[fieldKey] || 0) + 1;
            
            // Collect nested arrays for recursive processing
            if (Array.isArray(fieldValue) && fieldValue.length > 0) {
              if (!(fieldKey in nestedArrays)) {
                nestedArrays[fieldKey] = [];
              }
              nestedArrays[fieldKey] = nestedArrays[fieldKey].concat(fieldValue);
            }
            // Collect nested objects for recursive processing (including nulls)
            else if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
              // Track for dictionary detection (non-null only)
              if (fieldValue !== null) {
                if (!(fieldKey in dictionaryVariations)) {
                  dictionaryVariations[fieldKey] = [];
                }
                dictionaryVariations[fieldKey].push(fieldValue);
              }
              
              // Track ALL objects including nulls for recursive merging
              if (!(fieldKey in nestedObjects)) {
                nestedObjects[fieldKey] = [];
              }
              nestedObjects[fieldKey].push(fieldValue);
            }
            
            // Store first non-null value as base
            if (!(fieldKey in mergedObject) || mergedObject[fieldKey] === null) {
              mergedObject[fieldKey] = fieldValue;
            }
          }
        }
        
        // Process nested arrays to merge all variations
        for (const [fieldKey, allItems] of Object.entries(nestedArrays)) {
          if (allItems.length > 0 && allItems.every(item => item && typeof item === 'object' && !Array.isArray(item))) {
            // For nested arrays, we should recursively process them
            // But for now, just use the collected items directly
            mergedObject[fieldKey] = allItems;
          }
        }
        
        // Check if any fields are dictionaries with mixed value types
        for (const [fieldKey, variations] of Object.entries(dictionaryVariations)) {
          if (variations.length > 0) {
            // Collect all keys and values across all variations
            const allKeys = new Set<string>();
            const allValueTypes = new Set<string>();
            
            for (const dict of variations) {
              for (const [k, v] of Object.entries(dict)) {
                allKeys.add(k);
                if (v && typeof v === 'object' && !Array.isArray(v)) {
                  allValueTypes.add('object');
                } else {
                  allValueTypes.add(typeof v);
                }
              }
            }
            
            // Check if this looks like a dictionary with mixed types
            const numericKeys = Array.from(allKeys).filter(k => /^\d+$/.test(k));
            const hasNumericKeys = numericKeys.length > 0;
            const hasMixedValueTypes = allValueTypes.size > 1;
            
            if (hasNumericKeys && hasMixedValueTypes) {
              // This is a dictionary with mixed value types - use z.unknown()
              mergedObject[fieldKey] = { __dictionary_unknown: true };
            }
          }
        }
        
        // Process nested objects recursively
        for (const [fieldKey, objects] of Object.entries(nestedObjects)) {
          // Filter out null values for merging, but track if nulls exist
          const nonNullObjects = objects.filter(obj => obj !== null);
          const hasNulls = objects.some(obj => obj === null);
          
          if (nonNullObjects.length > 0 && !mergedObject[fieldKey]?.__dictionary_unknown) {
            // Recursively merge non-null nested objects
            const mergedNestedSchema = mergeArrayOfObjects(nonNullObjects, 0);
            // Extract just the object schema part (remove the const and z.array wrapper)
            const objectSchema = mergedNestedSchema.replace(/^const \w+ = z\.array\(/, '').replace(/\);$/, '');
            mergedObject[fieldKey] = { __mergedSchema: objectSchema };
            
            // If some objects were null, mark the field as nullable
            if (hasNulls) {
              mergedObject[`__nullable_${fieldKey}`] = true;
            }
          } else if (hasNulls && !mergedObject[fieldKey]) {
            // All nested objects are null
            mergedObject[fieldKey] = null;
            mergedObject[`__nullable_${fieldKey}`] = true;
          }
        }
        
        const totalObjects = sample.length;
        
        // Mark fields as nullable or optional based on analysis
        for (const [fieldKey, valueSet] of Object.entries(fieldValues)) {
          const hasNull = valueSet.has(null);
          const hasNonNull = Array.from(valueSet).some(v => v !== null);
          const fieldCount = fieldCounts[fieldKey] || 0;
          
          if (hasNull && hasNonNull) {
            mergedObject[`__nullable_${fieldKey}`] = true;
          }
          if (fieldCount < totalObjects) {
            mergedObject[`__optional_${fieldKey}`] = true;
          }
        }
        
        const itemType = generateZodObjectSchema(mergedObject, 0);
        return `const ${schemaName} = z.array(${itemType});`;
      }
      
      // For arrays of primitives or mixed types, use first item
      const itemType = getZodTypeForValue(sample[0], 0);
      return `const ${schemaName} = z.array(${itemType});`;
    }
    return `const ${schemaName} = z.array(z.unknown());`;
  }

  if (typeof sample === 'object' && sample !== null) {
    // For dictionary-like objects (like car assets with numeric keys or paint_rules with mixed keys)
    const keys = Object.keys(sample);
    // Detect dictionaries: mostly numeric keys, OR mix of numeric and special keys
    const numericKeys = keys.filter(k => /^\d+$/.test(k));
    const isDictionary = keys.length > 0 && (
      keys.every(k => /^\d+$/.test(k)) || // All numeric
      (numericKeys.length > 0 && numericKeys.length >= keys.length * 0.7) // Mostly numeric
    );
    
    if (isDictionary) {
      const allValues = Object.values(sample);
      
      // If all values are primitives, use simple record
      if (allValues.every(v => typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean')) {
        const firstValue = allValues[0];
        const valueType = getZodTypeForValue(firstValue, 0);
        return `const ${schemaName} = z.record(z.string(), ${valueType});`;
      }
      
      // Check if we have mixed value types (objects and primitives)
      const hasObjects = allValues.some(v => v && typeof v === 'object' && !Array.isArray(v));
      const hasPrimitives = allValues.some(v => typeof v === 'boolean' || typeof v === 'string' || typeof v === 'number');
      
      if (hasObjects && hasPrimitives) {
        // Mixed types - use z.unknown() for maximum flexibility
        return `const ${schemaName} = z.record(z.string(), z.unknown());`;
      }
      
      // For complex objects, merge all values to detect nullable fields
      if (allValues.every(v => v && typeof v === 'object' && !Array.isArray(v))) {
        // Merge all objects to detect field variations
        const mergedObject: any = {};
        const fieldValues: Record<string, Set<any>> = {};
        
        // Collect all field values to detect variations
        for (const value of allValues) {
          for (const [fieldKey, fieldValue] of Object.entries(value as any)) {
            if (!(fieldKey in mergedObject)) {
              mergedObject[fieldKey] = fieldValue;
            }
            if (!(fieldKey in fieldValues)) {
              fieldValues[fieldKey] = new Set();
            }
            fieldValues[fieldKey].add(fieldValue);
          }
        }
        
        // Mark ALL fields as both optional AND nullable for dictionary objects
        // because sample data doesn't capture all API variations
        for (const fieldKey of Object.keys(mergedObject)) {
          mergedObject[`__optional_${fieldKey}`] = true;
          mergedObject[`__nullable_${fieldKey}`] = true;
        }
        
        const valueType = generateZodObjectSchema(mergedObject, 0);
        return `const ${schemaName} = z.record(z.string(), ${valueType});`;
      }
      
      // Fallback for mixed/unknown types
      const firstValue = allValues[0];
      const valueType = getZodTypeForValue(firstValue, 0);
      return `const ${schemaName} = z.record(z.string(), ${valueType});`;
    }

    // For regular objects, generate a proper object schema
    const zodObjectSchema = generateZodObjectSchema(sample, 0);
    return `const ${schemaName} = ${zodObjectSchema};`;
  }

  return `const ${schemaName} = ${getZodTypeForValue(sample, 0)};`;
}

/** ---- Get TypeScript type for a value ---- */
function getTypeForValue(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const type = typeof value;

  switch (type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const itemType = getTypeForValue(value[0]);
          return `Array<${itemType}>`;
        }
        return "Array<unknown>";
      }
      return getSpecificObjectType(value);
    default:
      return "any";
  }
}

function getSpecificObjectType(obj: any): string {
  if (!obj || typeof obj !== 'object') {
    return "any";
  }

  // Check for known object structures and return specific types
  const keys = Object.keys(obj);

  // Track map layers structure
  if (keys.includes("background") && keys.includes("inactive") && keys.includes("active") && keys.includes("pitroad")) {
    return "TrackMapLayers";
  }

  // Car type structure
  if (keys.includes("car_type") && keys.length === 1) {
    return "{ carType: string }";
  }

  // Member account structure (only in member context)
  if (keys.includes("ir_dollars") && keys.includes("ir_credits") && keys.includes("status")) {
    return "{ irDollars: number; irCredits: number; status: string; countryRules?: string | null }";
  }

  // Helmet structure (only in member context)
  if (keys.includes("pattern") && keys.includes("color1") && keys.includes("helmet_type")) {
    return "{ pattern: number; color1: string; color2: string; color3: string; faceType: number; helmetType: number }";
  }

  // Suit structure (only in member context)
  if (keys.includes("pattern") && keys.includes("color1") && keys.includes("body_type")) {
    return "{ pattern: number; color1: string; color2: string; color3: string; bodyType: number }";
  }

  // License structure (simplified to avoid conflicts)
  if (keys.includes("category_id") && keys.includes("safety_rating") && keys.includes("irating")) {
    return "Record<string, unknown>";
  }

  // Cars in class structure (only for simple objects with exactly these 4 keys)
  if (keys.includes("car_dirpath") && keys.includes("car_id") && keys.includes("rain_enabled") && keys.includes("retired") && keys.length === 4) {
    return "CarInClass";
  }

  // Generic fallback
  return "Record<string, unknown>";
}

function getCommonSchemasForSection(sectionName: string): string[] {
  const commonSchemas: string[] = [];

  // Track map layers schema (for track section)
  if (sectionName === "track") {
    commonSchemas.push(`const TrackMapLayersSchema = z.object({
  background: z.string(),
  inactive: z.string(),
  active: z.string(),
  pitroad: z.string(),
  startFinish: z.string(), // maps from: start-finish
  turns: z.string()
});`);
  }

  // Car class specific schemas
  if (sectionName === "carclass") {
    commonSchemas.push(`const CarInClassSchema = z.object({
  carDirpath: z.string(), // maps from: car_dirpath
  carId: z.number(), // maps from: car_id
  rainEnabled: z.boolean(), // maps from: rain_enabled
  retired: z.boolean()
});`);
  }

  return commonSchemas;
}

/** ---- Generate section types file ---- */
async function generateSectionTypes(sectionName: string, endpoints: Flat[]): Promise<string> {
  const lines: string[] = [];

  lines.push(`import * as z from "zod/mini";`);
  lines.push(``);

  // Add common schema definitions based on section
  const commonSchemas = getCommonSchemasForSection(sectionName);
  if (commonSchemas.length > 0) {
    lines.push("// ---- Common Schemas ----");
    lines.push("");
    lines.push(...commonSchemas);
    lines.push("");
  }

  // Generate schemas from samples (primary source of truth)
  const responseSchemas: string[] = [];
  for (const ep of endpoints) {
    if (ep.samplePath) {
      try {
        // Try to load multiple sample variations if they exist
        const sampleFiles = findSampleVariations(ep.samplePath);
        let mergedSampleData = null;

        for (const sampleFile of sampleFiles) {
          try {
            const sampleData = JSON.parse(fs.readFileSync(sampleFile, "utf8"));
            if (mergedSampleData === null) {
              mergedSampleData = sampleData;
            } else {
              // Merge sample data to get richer type information
              mergedSampleData = mergeSampleData(mergedSampleData, sampleData);
            }
          } catch (fileError) {
            console.warn(`Failed to load sample ${sampleFile}:`, fileError);
          }
        }

        if (mergedSampleData !== null) {
          const schemaName = `${toPascal(ep.method)}`;
          const zodSchema = generateZodSchemaFromSample(mergedSampleData, schemaName);
          responseSchemas.push(zodSchema);
        } else {
          throw new Error("No valid sample data found");
        }
      } catch (error) {
        console.warn(`Failed to generate schema from ${ep.samplePath}:`, error);
        // Fallback to generic schema
        const schemaName = `${toPascal(ep.method)}`;
        responseSchemas.push(`const ${schemaName} = z.unknown();`);
      }
    }
  }

  /** ---- Helper to find sample variation files ---- */
  function findSampleVariations(baseSamplePath: string): string[] {
    const sampleFiles: string[] = [];

    // Always include the base sample if it exists
    if (fs.existsSync(baseSamplePath)) {
      sampleFiles.push(baseSamplePath);
    }

    // Look for variation files (ending with _var2.json, _var3.json, etc.)
    const baseDir = path.dirname(baseSamplePath);
    const baseName = path.basename(baseSamplePath, '.json');

    try {
      const files = fs.readdirSync(baseDir);
      for (const file of files) {
        if (file.startsWith(`${baseName}_var`) && file.endsWith('.json')) {
          sampleFiles.push(path.join(baseDir, file));
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }

    return sampleFiles;
  }

  /** ---- Helper to merge sample data for richer schemas ---- */
  function mergeSampleData(base: any, additional: any): any {
    if (Array.isArray(base) && Array.isArray(additional)) {
      // For arrays, combine all unique items by structure
      const merged = [...base];
      for (const item of additional) {
        // Add items that have different structures (more fields, etc.)
        const hasMatchingStructure = merged.some(existing =>
          Object.keys(existing).length === Object.keys(item).length &&
          Object.keys(existing).every(key => key in item)
        );
        if (!hasMatchingStructure) {
          merged.push(item);
        }
      }
      return merged;
    } else if (typeof base === 'object' && base !== null && typeof additional === 'object' && additional !== null) {
      // For objects, merge all properties and track type variations
      const merged = { ...base };
      
      // First, mark fields that exist in additional but not in base as optional
      for (const key of Object.keys(additional)) {
        if (!(key in base)) {
          merged[`__optional_${key}`] = true;
          merged[key] = additional[key];
        }
      }
      
      // Then mark fields that exist in base but not in additional as optional
      for (const key of Object.keys(base)) {
        if (!(key in additional)) {
          merged[`__optional_${key}`] = true;
        }
      }
      
      // Process fields that exist in both
      for (const [key, value] of Object.entries(additional)) {
        if (key in base) {
          if (typeof merged[key] === 'object' && typeof value === 'object' && merged[key] !== null && value !== null) {
            merged[key] = mergeSampleData(merged[key], value);
          } else if (merged[key] !== value) {
            // Different values for same key - this field can vary!
            // Create a marker to indicate this field can be multiple types
            if (merged[key] === null || value === null) {
              // One is null, mark this field as nullable
              merged[`__nullable_${key}`] = true;
            }
            // Keep non-null value as example
            merged[key] = merged[key] !== null ? merged[key] : value;
          }
        }
      }
      return merged;
    }

    // For primitives, return the base value
    return base;
  }

  lines.push(`// ---- Response Schemas ----`);
  lines.push(``);
  lines.push(...responseSchemas);
  lines.push(``);

  // Generate TypeScript types from schemas
  lines.push(`// ---- Response Types (inferred from schemas) ----`);
  lines.push(``);
  for (const ep of endpoints) {
    if (ep.samplePath) {
      const schemaName = `${toPascal(ep.method)}`;
      const typeName = `${toPascal(ep.method)}Response`;
      lines.push(`export type ${typeName} = z.infer<typeof ${schemaName}>;`);
    }
  }
  lines.push(``);

  lines.push(`// ---- Parameter Schemas ----`);
  lines.push(``);

  // Generate parameter schemas
  for (const ep of endpoints) {
    const schemaName = `${toPascal(ep.method)}ParamsSchema`;
    lines.push(`const ${schemaName} = z.object({`);

    for (const [paramName, paramDef] of Object.entries(ep.params)) {
      let zodType = "z.unknown()";

      switch (paramDef.type) {
        case "string":
          zodType = "z.string()";
          break;
        case "number":
          zodType = "z.number()";
          break;
        case "boolean":
          zodType = "z.boolean()";
          break;
        case "numbers":
          zodType = "z.array(z.number())";
          break;
      }

      if (!paramDef.required) {
        zodType = `z.optional(${zodType})`;
      }

      // Convert param name to camelCase for the schema
      const camelParamName = toCamelCase(paramName);
      const comment = paramDef.note ? ` // ${paramDef.note}` : "";

      // If the param name differs from original, we need to map it
      if (camelParamName !== paramName) {
        lines.push(`  ${camelParamName}: ${zodType},${comment} // maps to: ${paramName}`);
      } else {
        lines.push(`  ${paramName}: ${zodType},${comment}`);
      }
    }

    lines.push(`});`);
    lines.push(``);
  }

  lines.push(`// ---- Exported Parameter Types ----`);
  lines.push(``);

  // Export parameter types
  for (const ep of endpoints) {
    const typeName = `${toPascal(ep.method)}Params`;
    const schemaName = `${toPascal(ep.method)}ParamsSchema`;
    lines.push(`export type ${typeName} = z.infer<typeof ${schemaName}>;`);
  }

  lines.push(``);
  lines.push(`// ---- Exported Schemas ----`);
  lines.push(``);
  lines.push(`export {`);

  // Export parameter schemas
  for (const ep of endpoints) {
    const schemaName = `${toPascal(ep.method)}ParamsSchema`;
    lines.push(`  ${schemaName},`);
  }

  // Export response schemas
  for (const ep of endpoints) {
    if (ep.responseType) {
      const schemaName = `${ep.responseType.replace('Response', '')}`;
      lines.push(`  ${schemaName},`);
    }
  }

  lines.push(`};`);

  return lines.join("\n");
}

/** ---- Generate mock test parameters from parameter definitions ---- */
function generateMockParams(params: Record<string, any>): string {
  const mockValues: string[] = [];

  for (const [paramName, paramDef] of Object.entries(params)) {
    const camelParamName = toCamelCase(paramName);
    let mockValue: string;

    switch (paramDef.type) {
      case "string":
        mockValue = '"test"';
        break;
      case "number":
        mockValue = '123';
        break;
      case "boolean":
        mockValue = 'true';
        break;
      case "numbers":
        mockValue = '[123, 456]';
        break;
      default:
        mockValue = '"test"';
    }

    mockValues.push(`  ${camelParamName}: ${mockValue}`);
  }

  if (mockValues.length === 0) {
    return '{}';
  }

  return `{\n${mockValues.join(',\n')}\n      }`;
}

/** ---- Generate unit test for a section ---- */
function generateSectionTest(sectionName: string, endpoints: Flat[]): string {
  const lines: string[] = [];
  const className = toPascal(sectionName) + "Service";
  const servicePath = "./service";

  lines.push(`import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";`);
  lines.push(`import { ${className} } from "${servicePath}";`);
  lines.push(`import { IRacingClient } from "../client";`);
  lines.push(``);

  // Import sample data for endpoints that have samples
  const sampleImports: string[] = [];
  for (const ep of endpoints) {
    if (ep.samplePath) {
      const importName = toCamelCase(ep.method) + "Sample";
      const relativePath = `../../${ep.samplePath}`;
      sampleImports.push(`import ${importName} from "${relativePath}";`);
    }
  }

  if (sampleImports.length > 0) {
    lines.push(`// Import sample data`);
    lines.push(...sampleImports);
    lines.push(``);
  }

  lines.push(`describe("${className}", () => {`);
  lines.push(`  let mockFetch: MockInstance;`);
  lines.push(`  let client: IRacingClient;`);
  lines.push(`  let ${toCamelCase(sectionName)}Service: ${className};`);
  lines.push(``);
  lines.push(`  beforeEach(() => {`);
  lines.push(`    mockFetch = vi.fn();`);
  lines.push(`    `);
  lines.push(`    client = new IRacingClient({`);
  lines.push(`      email: "test@example.com",`);
  lines.push(`      password: "password",`);
  lines.push(`      fetchFn: mockFetch`);
  lines.push(`    });`);
  lines.push(`    `);
  lines.push(`    ${toCamelCase(sectionName)}Service = new ${className}(client);`);
  lines.push(`  });`);
  lines.push(``);

  // Generate test for each endpoint
  for (const ep of endpoints) {
    const methodName = toCamelCase(ep.name.replace(/\./g, "_"));
    const hasParams = Object.keys(ep.params).length > 0;
    const sampleName = toCamelCase(ep.method) + "Sample";

    lines.push(`  describe("${methodName}()", () => {`);

    if (ep.samplePath) {
      lines.push(`    it("should fetch, transform, and validate ${sectionName} ${methodName} data", async () => {`);
      lines.push(`      // Mock auth response`);
      lines.push(`      mockFetch.mockResolvedValueOnce({`);
      lines.push(`        ok: true,`);
      lines.push(`        json: () => Promise.resolve({`);
      lines.push(`          authcode: "test123",`);
      lines.push(`          ssoCookieValue: "cookie123",`);
      lines.push(`          email: "test@example.com"`);
      lines.push(`        })`);
      lines.push(`      });`);
      lines.push(``);
      lines.push(`      // Mock API response with original snake_case format`);
      lines.push(`      mockFetch.mockResolvedValueOnce({`);
      lines.push(`        ok: true,`);
      lines.push(`        headers: { get: () => "application/json" },`);
      lines.push(`        json: () => Promise.resolve(${sampleName})`);
      lines.push(`      });`);
      lines.push(``);

      if (hasParams) {
        const mockParams = generateMockParams(ep.params);
        lines.push(`      const testParams = ${mockParams};`);
        lines.push(`      const result = await ${toCamelCase(sectionName)}Service.${methodName}(testParams);`);
      } else {
        lines.push(`      const result = await ${toCamelCase(sectionName)}Service.${methodName}();`);
      }

      lines.push(``);
      lines.push(`      // Verify authentication call`);
      lines.push(`      expect(mockFetch).toHaveBeenCalledWith(`);
      lines.push(`        "https://members-ng.iracing.com/auth",`);
      lines.push(`        expect.objectContaining({`);
      lines.push(`          method: "POST",`);
      lines.push(`          headers: { "Content-Type": "application/json" },`);
      lines.push(`          body: JSON.stringify({ email: "test@example.com", password: "password" })`);
      lines.push(`        })`);
      lines.push(`      );`);
      lines.push(``);

      lines.push(`      // Verify API call`);
      if (hasParams) {
        lines.push(`      expect(mockFetch).toHaveBeenCalledWith(`);
        lines.push(`        expect.stringContaining("${ep.url}"),`);
        lines.push(`        expect.objectContaining({`);
        lines.push(`          headers: expect.objectContaining({`);
        lines.push(`            Cookie: expect.stringContaining("irsso_membersv2=cookie123")`);
        lines.push(`          })`);
        lines.push(`        })`);
        lines.push(`      );`);
      } else {
        lines.push(`      expect(mockFetch).toHaveBeenCalledWith(`);
        lines.push(`        "${ep.url}",`);
        lines.push(`        expect.objectContaining({`);
        lines.push(`          headers: expect.objectContaining({`);
        lines.push(`            Cookie: expect.stringContaining("irsso_membersv2=cookie123")`);
        lines.push(`          })`);
        lines.push(`        })`);
        lines.push(`      );`);
      }

      lines.push(``);
      lines.push(`      // Verify response structure and transformation`);
      lines.push(`      expect(result).toBeDefined();`);
      lines.push(`      expect(typeof result).toBe("object");`);
      lines.push(`    });`);
      lines.push(``);

      lines.push(`    it("should handle schema validation errors", async () => {`);
      lines.push(`      // Mock auth response`);
      lines.push(`      mockFetch.mockResolvedValueOnce({`);
      lines.push(`        ok: true,`);
      lines.push(`        json: () => Promise.resolve({`);
      lines.push(`          authcode: "test123",`);
      lines.push(`          ssoCookieValue: "cookie123",`);
      lines.push(`          email: "test@example.com"`);
      lines.push(`        })`);
      lines.push(`      });`);
      lines.push(``);
      lines.push(`      // Mock invalid API response`);
      lines.push(`      mockFetch.mockResolvedValueOnce({`);
      lines.push(`        ok: true,`);
      lines.push(`        headers: { get: () => "application/json" },`);
      lines.push(`        json: () => Promise.resolve({ invalid: "data" })`);
      lines.push(`      });`);
      lines.push(``);

      if (hasParams) {
        const mockParams = generateMockParams(ep.params);
        lines.push(`      const testParams = ${mockParams};`);
        lines.push(`      await expect(${toCamelCase(sectionName)}Service.${methodName}(testParams)).rejects.toThrow();`);
      } else {
        lines.push(`      await expect(${toCamelCase(sectionName)}Service.${methodName}()).rejects.toThrow();`);
      }

      lines.push(`    });`);
    } else {
      // No sample data - generate basic test
      lines.push(`    it("should fetch ${sectionName} ${methodName} data", async () => {`);
      lines.push(`      // Mock auth response`);
      lines.push(`      mockFetch.mockResolvedValueOnce({`);
      lines.push(`        ok: true,`);
      lines.push(`        json: () => Promise.resolve({`);
      lines.push(`          authcode: "test123",`);
      lines.push(`          ssoCookieValue: "cookie123",`);
      lines.push(`          email: "test@example.com"`);
      lines.push(`        })`);
      lines.push(`      });`);
      lines.push(``);
      lines.push(`      // Mock API response`);
      lines.push(`      mockFetch.mockResolvedValueOnce({`);
      lines.push(`        ok: true,`);
      lines.push(`        headers: { get: () => "application/json" },`);
      lines.push(`        json: () => Promise.resolve({})`);
      lines.push(`      });`);
      lines.push(``);

      if (hasParams) {
        const mockParams = generateMockParams(ep.params);
        lines.push(`      const testParams = ${mockParams};`);
        lines.push(`      await ${toCamelCase(sectionName)}Service.${methodName}(testParams);`);
      } else {
        lines.push(`      await ${toCamelCase(sectionName)}Service.${methodName}();`);
      }

      lines.push(`      expect(mockFetch).toHaveBeenCalled();`);
      lines.push(`    });`);
    }

    lines.push(`  });`);
    lines.push(``);
  }

  lines.push(`});`);

  return lines.join("\n");
}

/** ---- Generate service class for a section ---- */
function generateSectionService(sectionName: string, endpoints: Flat[]): string {
  const lines: string[] = [];
  const className = toPascal(sectionName) + "Service";
  const typesFile = `./types`;

  lines.push(`import type { IRacingClient } from "../client";`);

  // Import types - only import parameter types that are actually used
  const paramImports = endpoints
    .filter(ep => Object.keys(ep.params).length > 0)
    .map(ep => `${toPascal(ep.method)}Params`);
  const responseImports = endpoints
    .filter(ep => ep.responseType)
    .map(ep => ep.responseType!);

  const allImports = [...paramImports, ...responseImports];
  if (allImports.length > 0) {
    lines.push(`import type { ${allImports.join(", ")} } from "${typesFile}";`);
  }

  // Import schemas
  const schemaImports = endpoints
    .filter(ep => ep.responseType)
    .map(ep => `${ep.responseType!.replace('Response', '')}`);

  if (schemaImports.length > 0) {
    lines.push(`import { ${schemaImports.join(", ")} } from "${typesFile}";`);
  }
  lines.push(``);

  // Generate service class
  lines.push(`export class ${className} {`);
  lines.push(`  constructor(private client: IRacingClient) {}`);
  lines.push(``);

  for (const ep of endpoints) {
    // Use camelCase for the method name
    const methodName = toCamelCase(ep.name.replace(/\./g, "_"));
    const paramsType = `${toPascal(ep.method)}Params`;
    const returnType = ep.responseType || "unknown";
    const hasParams = Object.keys(ep.params).length > 0;

    lines.push(`  /**`);
    lines.push(`   * ${ep.name}`);
    lines.push(`   * @see ${ep.url}`);
    if (ep.samplePath) {
      lines.push(`   * @sample ${ep.samplePath.replace(SAMPLES_DIR + "/", "")}`);
    }
    lines.push(`   */`);

    if (hasParams) {
      lines.push(`  async ${methodName}(params: ${paramsType}): Promise<${returnType}> {`);
      if (ep.responseType) {
        const schemaName = `${ep.responseType.replace('Response', '')}`;
        lines.push(`    return this.client.get<${returnType}>("${ep.url}", { params, schema: ${schemaName} });`);
      } else {
        lines.push(`    return this.client.get<${returnType}>("${ep.url}", { params });`);
      }
    } else {
      lines.push(`  async ${methodName}(): Promise<${returnType}> {`);
      if (ep.responseType) {
        const schemaName = `${ep.responseType.replace('Response', '')}`;
        lines.push(`    return this.client.get<${returnType}>("${ep.url}", { schema: ${schemaName} });`);
      } else {
        lines.push(`    return this.client.get<${returnType}>("${ep.url}");`);
      }
    }

    lines.push(`  }`);
    lines.push(``);
  }

  lines.push(`}`);

  return lines.join("\n");
}

/** ---- Generate client base class ---- */
function generateClientBase(): string {
  return `import * as z from "zod/mini";

/** Lightweight client with presigned-link following and caching */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const IRacingClientOptionsSchema = z.object({
  email: z.optional(z.string()),
  password: z.optional(z.string()),
  headers: z.optional(z.record(z.string(), z.string())),
  fetchFn: z.optional(z.any()),
  validateParams: z.optional(z.boolean()),
});

export type IRacingClientOptions = z.infer<typeof IRacingClientOptionsSchema>;

interface AuthResponse {
  authcode: string;
  autoLoginSeries: null | string;
  autoLoginToken: null | string;
  custId: number;
  email: string;
  ssoCookieDomain: string;
  ssoCookieName: string;
  ssoCookiePath: string;
  ssoCookieValue: string;
}

interface S3Response {
  link: string;
  expires: string;
}

type CacheEntry = { data: unknown; expiresAt: number };

export class IRacingError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly statusText?: string,
    public readonly responseData?: any
  ) {
    super(message);
    this.name = 'IRacingError';
  }

  get isMaintenanceMode(): boolean {
    return this.status === 503 &&
           this.responseData?.error === 'Site Maintenance';
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export class IRacingClient {
  private baseUrl = 'https://members-ng.iracing.com';
  private fetchFn: FetchLike;
  private authData: AuthResponse | null = null;
  private cookies: Record<string, string> | null = null;
  private email?: string;
  private password?: string;
  private presetHeaders?: Record<string, string>;
  private validateParams: boolean;
  private expiringCache = new Map<string, CacheEntry>();

  constructor(opts: IRacingClientOptions = {}) {
    const validatedOpts = IRacingClientOptionsSchema.parse(opts);

    this.fetchFn = validatedOpts.fetchFn ?? globalThis.fetch;
    if (!this.fetchFn) throw new Error("No fetch available. Pass fetchFn in IRacingClientOptions.");

    this.email = validatedOpts.email;
    this.password = validatedOpts.password;
    this.presetHeaders = validatedOpts.headers;
    this.validateParams = validatedOpts.validateParams ?? true;

    if (!this.email && !this.password && !this.presetHeaders) {
      throw new Error("Must provide either email/password or headers for authentication");
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint.startsWith("http") ? endpoint : \`\${this.baseUrl}\${endpoint}\`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, value.join(","));
          } else if (typeof value === "boolean") {
            url.searchParams.append(key, value ? "true" : "false");
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url.toString();
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.presetHeaders) {
      // Using preset headers, no authentication needed
      return;
    }

    if (!this.authData && this.email && this.password) {
      await this.authenticate();
    }
  }

  private async authenticate(): Promise<void> {
    if (!this.email || !this.password) {
      throw new Error("Email and password required for authentication");
    }

    const response = await this.fetchFn(\`\${this.baseUrl}/auth\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(\`Authentication failed: \${response.statusText} - \${text}\`);
    }

    this.authData = await response.json();

    // Parse and store cookies
    if (!this.authData) {
      throw new Error('Authentication failed - no auth data received');
    }

    this.cookies = {
      'irsso_membersv2': this.authData.ssoCookieValue,
      'authtoken_members': \`%7B%22authtoken%22%3A%7B%22authcode%22%3A%22\${this.authData.authcode}%22%2C%22email%22%3A%22\${encodeURIComponent(this.authData.email)}%22%7D%7D\`
    };
  }

  private mapParamsToApi(params?: Record<string, any>): Record<string, any> | undefined {
    if (!params) return undefined;
    const mapped: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
      mapped[snakeKey] = value;
    }
    return mapped;
  }

  private mapResponseFromApi(data: any): any {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map(item => this.mapResponseFromApi(item));
    }

    if (typeof data === 'object') {
      const mapped: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        // Convert snake_case to camelCase
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        mapped[camelKey] = this.mapResponseFromApi(value);
      }
      return mapped;
    }

    return data;
  }


  async get<T = unknown>(url: string, options?: { params?: Record<string, any>; schema?: z.ZodMiniType<T> }): Promise<T> {
    await this.ensureAuthenticated();

    // Convert camelCase params back to snake_case for the API
    const apiParams = this.mapParamsToApi(options?.params);

    const headers: Record<string, string> = {};

    if (this.presetHeaders) {
      // Use preset headers (like cookies from manual auth)
      Object.assign(headers, this.presetHeaders);
    } else if (this.cookies) {
      // Use authenticated cookies
      const cookieString = Object.entries(this.cookies)
        .map(([name, value]) => \`\${name}=\${value}\`)
        .join('; ');
      headers['Cookie'] = cookieString;
    } else {
      throw new Error('No authentication available');
    }

    const response = await this.fetchFn(this.buildUrl(url, apiParams), {
      headers,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      let responseData: any = null;

      // Try to parse JSON error response
      try {
        responseData = JSON.parse(text);
      } catch {
        // Not JSON, use raw text
      }

      // Handle maintenance mode specifically
      if (response.status === 503 && responseData?.error === 'Site Maintenance') {
        throw new IRacingError(
          \`iRacing is currently in maintenance mode: \${responseData.message || 'Service temporarily unavailable'}\`,
          response.status,
          response.statusText,
          responseData
        );
      }

      // Handle other specific errors
      if (response.status === 429) {
        throw new IRacingError(
          'Rate limit exceeded. Please wait before making more requests.',
          response.status,
          response.statusText,
          responseData
        );
      }

      if (response.status === 401) {
        throw new IRacingError(
          'Authentication failed. Please check your credentials.',
          response.status,
          response.statusText,
          responseData
        );
      }

      // Generic error
      const errorMessage = responseData?.message || responseData?.error || text || response.statusText;
      throw new IRacingError(
        \`Request failed: \${errorMessage}\`,
        response.status,
        response.statusText,
        responseData
      );
    }

    const contentType = response.headers.get("content-type") || "";

    // Check if this is a direct JSON response (some endpoints don't use S3)
    if (contentType.includes("application/json")) {
      const data = await response.json();

      // Check if it's an S3 link response
      if (data.link && data.expires) {
        // Fetch the actual data from S3
        const s3Response = await this.fetchFn(data.link);
        if (!s3Response.ok) {
          throw new Error(\`Failed to fetch from S3: \${s3Response.statusText}\`);
        }

        // Check content type of S3 response
        const s3ContentType = s3Response.headers.get("content-type") || "";
        if (s3ContentType.includes("text/csv") || s3ContentType.includes("text/plain")) {
          // Return CSV as raw text wrapped in an object
          const csvText = await s3Response.text();
          return {
            ContentType: "csv",
            RawData: csvText,
            Note: "This endpoint returns CSV data, not JSON"
          } as T;
        }

        const s3Data = await s3Response.json();
        const mappedData = this.mapResponseFromApi(s3Data);

        if (options?.schema) {
          return options.schema.parse(mappedData);
        }

        return mappedData as T;
      }

      const mappedData = this.mapResponseFromApi(data);

      if (options?.schema) {
        return options.schema.parse(mappedData);
      }

      return mappedData as T;
    }

    throw new Error(\`Unexpected content type: \${contentType}\`);
  }

  isAuthenticated(): boolean {
    return this.authData !== null || !!this.presetHeaders;
  }

  getCustomerId(): number | null {
    return this.authData?.custId ?? null;
  }
}
`;
}

/** ---- Generate main SDK class ---- */
function generateMainSDK(sections: string[]): string {
  const lines: string[] = [];

  lines.push(`/* AUTO-GENERATED — do not edit */`);
  lines.push(``);
  lines.push(`import { IRacingClient, IRacingError, type IRacingClientOptions } from "./client";`);

  // Import all service classes
  for (const section of sections) {
    const className = toPascal(section) + "Service";
    const dirName = toKebab(section);
    lines.push(`import { ${className} } from "./${dirName}/service";`);
  }

  lines.push(``);
  lines.push(`export { IRacingClient, IRacingError, type IRacingClientOptions };`);
  lines.push(``);

  // Export all types
  for (const section of sections) {
    const dirName = toKebab(section);
    lines.push(`export * from "./${dirName}/types";`);
  }

  lines.push(``);
  lines.push(`export class IRacingSDK {`);
  lines.push(`  private client: IRacingClient;`);
  lines.push(``);

  // Declare service properties
  for (const section of sections) {
    const propName = toCamelCase(section);
    const className = toPascal(section) + "Service";
    lines.push(`  public ${propName}: ${className};`);
  }

  lines.push(``);
  lines.push(`  constructor(opts: IRacingClientOptions = {}) {`);
  lines.push(`    this.client = new IRacingClient(opts);`);
  lines.push(``);

  // Initialize services
  for (const section of sections) {
    const propName = toCamelCase(section);
    const className = toPascal(section) + "Service";
    lines.push(`    this.${propName} = new ${className}(this.client);`);
  }

  lines.push(`  }`);
  lines.push(`}`);

  return lines.join("\n");
}

/** ---- Main execution ---- */
async function generateSDK() {
  const endpoints = flatten(index);
  const bySection = new Map<string, Flat[]>();

  for (const ep of endpoints) {
    const list = bySection.get(ep.section) || [];
    list.push(ep);
    bySection.set(ep.section, list);
  }

  // Create output directories
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Generate client base
  fs.writeFileSync(path.join(OUT_DIR, "client.ts"), generateClientBase(), "utf8");
  console.log(`Generated ${OUT_DIR}/client.ts`);

  // Generate files for each section
  const sections: string[] = [];
  for (const [section, eps] of bySection) {
    sections.push(section);

    const dirName = toKebab(section);
    const sectionDir = path.join(OUT_DIR, dirName);

    // Create directory for this service
    fs.mkdirSync(sectionDir, { recursive: true });

    // Generate types file
    const typesFile = path.join(sectionDir, "types.ts");
    const typesContent = await generateSectionTypes(section, eps);
    fs.writeFileSync(typesFile, typesContent, "utf8");
    console.log(`Generated ${typesFile} with ${eps.length} endpoints`);

    // Generate service file
    const serviceFile = path.join(sectionDir, "service.ts");
    fs.writeFileSync(serviceFile, generateSectionService(section, eps), "utf8");
    console.log(`Generated ${serviceFile}`);

    // Generate test file
    const testFile = path.join(sectionDir, "service.test.ts");
    fs.writeFileSync(testFile, generateSectionTest(section, eps), "utf8");
    console.log(`Generated ${testFile}`);
  }

  // Generate main SDK file
  fs.writeFileSync(path.join(OUT_DIR, "index.ts"), generateMainSDK(sections), "utf8");
  console.log(`Generated ${OUT_DIR}/index.ts`);

  console.log(`\nSuccessfully generated typed SDK with ${endpoints.length} endpoints across ${sections.length} sections!`);
}

// Run the generator
generateSDK().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});