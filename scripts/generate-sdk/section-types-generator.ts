import * as fs from "node:fs";
import * as path from "node:path";
import { toPascal, toCamelCase } from "./utils";
import { type Flat } from "./types";
import { generateZodSchemaFromSample } from "./schema-generator";
import { getCommonSchemasForSection } from "./type-generator";

/** ---- Generate section types file ---- */
export async function generateSectionTypes(sectionName: string, endpoints: Flat[]): Promise<string> {
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