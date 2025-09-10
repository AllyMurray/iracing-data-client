import { toCamelCase } from "./utils";

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