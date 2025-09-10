#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";
import { quicktype, InputData, JSONSchemaInput, TypeScriptTargetLanguage } from "quicktype-core";
import { toPascal, toCamelCase, toKebab } from "./generate-sdk/utils";
import { type Root, type Flat, type Endpoint, isEndpoint } from "./generate-sdk/types";
import { generateZodSchemaFromSample } from "./generate-sdk/schema-generator";
import { getTypeForValue, getSpecificObjectType, getCommonSchemasForSection } from "./generate-sdk/type-generator";
import { generateSectionService, generateSectionTest } from "./generate-sdk/service-generator";
import { generateClientBase } from "./generate-sdk/client-generator";

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