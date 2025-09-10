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

// ---- Parameter Schemas ----

const DriverStatsByCategoryOvalParamsSchema = z.object({
});

const DriverStatsByCategorySportsCarParamsSchema = z.object({
});

const DriverStatsByCategoryFormulaCarParamsSchema = z.object({
});

const DriverStatsByCategoryRoadParamsSchema = z.object({
});

const DriverStatsByCategoryDirtOvalParamsSchema = z.object({
});

const DriverStatsByCategoryDirtRoadParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type DriverStatsByCategoryOvalParams = z.infer<typeof DriverStatsByCategoryOvalParamsSchema>;
export type DriverStatsByCategorySportsCarParams = z.infer<typeof DriverStatsByCategorySportsCarParamsSchema>;
export type DriverStatsByCategoryFormulaCarParams = z.infer<typeof DriverStatsByCategoryFormulaCarParamsSchema>;
export type DriverStatsByCategoryRoadParams = z.infer<typeof DriverStatsByCategoryRoadParamsSchema>;
export type DriverStatsByCategoryDirtOvalParams = z.infer<typeof DriverStatsByCategoryDirtOvalParamsSchema>;
export type DriverStatsByCategoryDirtRoadParams = z.infer<typeof DriverStatsByCategoryDirtRoadParamsSchema>;

// ---- Exported Schemas ----

export {
  DriverStatsByCategoryOvalParamsSchema,
  DriverStatsByCategorySportsCarParamsSchema,
  DriverStatsByCategoryFormulaCarParamsSchema,
  DriverStatsByCategoryRoadParamsSchema,
  DriverStatsByCategoryDirtOvalParamsSchema,
  DriverStatsByCategoryDirtRoadParamsSchema,
  DriverStatsByCategoryOval,
  DriverStatsByCategorySportsCar,
  DriverStatsByCategoryFormulaCar,
  DriverStatsByCategoryRoad,
  DriverStatsByCategoryDirtOval,
  DriverStatsByCategoryDirtRoad,
};