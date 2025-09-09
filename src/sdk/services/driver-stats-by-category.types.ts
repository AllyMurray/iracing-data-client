import { z } from "zod-mini";

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

// ---- Exported Types ----

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
};