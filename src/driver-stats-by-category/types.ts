import * as z from "zod/mini";

// ---- Response Schemas ----

const DriverStatsByCategoryOval = z.object({
  ContentType: z.literal("csv"),
  RawData: z.string(),
  Note: z.string()
});
const DriverStatsByCategorySportsCar = z.object({
  ContentType: z.literal("csv"),
  RawData: z.string(),
  Note: z.string()
});
const DriverStatsByCategoryFormulaCar = z.object({
  ContentType: z.literal("csv"),
  RawData: z.string(),
  Note: z.string()
});
const DriverStatsByCategoryRoad = z.object({
  ContentType: z.literal("csv"),
  RawData: z.string(),
  Note: z.string()
});
const DriverStatsByCategoryDirtOval = z.object({
  ContentType: z.literal("csv"),
  RawData: z.string(),
  Note: z.string()
});
const DriverStatsByCategoryDirtRoad = z.object({
  ContentType: z.literal("csv"),
  RawData: z.string(),
  Note: z.string()
});

// ---- Response Types (inferred from schemas) ----

export type DriverStatsByCategoryOvalResponse = z.infer<typeof DriverStatsByCategoryOval>;
export type DriverStatsByCategorySportsCarResponse = z.infer<typeof DriverStatsByCategorySportsCar>;
export type DriverStatsByCategoryFormulaCarResponse = z.infer<typeof DriverStatsByCategoryFormulaCar>;
export type DriverStatsByCategoryRoadResponse = z.infer<typeof DriverStatsByCategoryRoad>;
export type DriverStatsByCategoryDirtOvalResponse = z.infer<typeof DriverStatsByCategoryDirtOval>;
export type DriverStatsByCategoryDirtRoadResponse = z.infer<typeof DriverStatsByCategoryDirtRoad>;

// ---- Parameter Validators ----

const driverStatsByCategoryOvalParams = z.object({
});

const driverStatsByCategorySportsCarParams = z.object({
});

const driverStatsByCategoryFormulaCarParams = z.object({
});

const driverStatsByCategoryRoadParams = z.object({
});

const driverStatsByCategoryDirtOvalParams = z.object({
});

const driverStatsByCategoryDirtRoadParams = z.object({
});

// ---- Exported Parameter Types ----

export type DriverStatsByCategoryOvalParams = z.infer<typeof driverStatsByCategoryOvalParams>;
export type DriverStatsByCategorySportsCarParams = z.infer<typeof driverStatsByCategorySportsCarParams>;
export type DriverStatsByCategoryFormulaCarParams = z.infer<typeof driverStatsByCategoryFormulaCarParams>;
export type DriverStatsByCategoryRoadParams = z.infer<typeof driverStatsByCategoryRoadParams>;
export type DriverStatsByCategoryDirtOvalParams = z.infer<typeof driverStatsByCategoryDirtOvalParams>;
export type DriverStatsByCategoryDirtRoadParams = z.infer<typeof driverStatsByCategoryDirtRoadParams>;

// ---- Exported Schemas ----

export {
  DriverStatsByCategoryOval,
  DriverStatsByCategorySportsCar,
  DriverStatsByCategoryFormulaCar,
  DriverStatsByCategoryRoad,
  DriverStatsByCategoryDirtOval,
  DriverStatsByCategoryDirtRoad,
};