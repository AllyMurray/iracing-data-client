import * as fs from "node:fs";
import { quicktype, InputData } from "quicktype-core";
import { toCamelCase, toPascal } from "./utils";

/** ---- Get TypeScript type for a value ---- */
export function getTypeForValue(value: any): string {
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

export function getSpecificObjectType(obj: any): string {
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

/** ---- Generate TypeScript types from JSON sample using quicktype ---- */
export async function generateTypesFromSample(samplePath: string, typeName: string): Promise<string | null> {
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
export function generateTypeFromJson(obj: any, typeName: string, indent: string = ""): string {
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