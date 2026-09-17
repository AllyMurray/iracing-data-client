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
