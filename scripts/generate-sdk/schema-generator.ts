import { toCamelCase } from "./utils";

/** ---- Generate Zod schema from JSON sample ---- */
export function generateZodSchemaFromSample(sample: any, schemaName: string): string {
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

export function getCommonSchemasForSection(sectionName: string): string[] {
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