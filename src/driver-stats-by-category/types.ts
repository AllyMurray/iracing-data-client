import * as z from "zod/mini";

// ---- Response Schemas ----

const DriverStatsByCategoryOvalSchema = z.object({
  _contentType: z.literal("csv"),
  _rawData: z.string(),
  _note: z.string()
});
const DriverStatsByCategorySportsCarSchema = z.object({
  _contentType: z.literal("csv"),
  _rawData: z.string(),
  _note: z.string()
});
const DriverStatsByCategoryFormulaCarSchema = z.object({
  _contentType: z.literal("csv"),
  _rawData: z.string(),
  _note: z.string()
});
const DriverStatsByCategoryRoadSchema = z.object({
  _contentType: z.literal("csv"),
  _rawData: z.string(),
  _note: z.string()
});
const DriverStatsByCategoryDirtOvalSchema = z.object({
  _contentType: z.literal("csv"),
  _rawData: z.string(),
  _note: z.string()
});
const DriverStatsByCategoryDirtRoadSchema = z.object({
  _contentType: z.literal("csv"),
  _rawData: z.string(),
  _note: z.string()
});

// ---- Response Types (inferred from schemas) ----

export type DriverStatsByCategoryOvalResponse = z.infer<typeof DriverStatsByCategoryOvalSchema>;
export type DriverStatsByCategorySportsCarResponse = z.infer<typeof DriverStatsByCategorySportsCarSchema>;
export type DriverStatsByCategoryFormulaCarResponse = z.infer<typeof DriverStatsByCategoryFormulaCarSchema>;
export type DriverStatsByCategoryRoadResponse = z.infer<typeof DriverStatsByCategoryRoadSchema>;
export type DriverStatsByCategoryDirtOvalResponse = z.infer<typeof DriverStatsByCategoryDirtOvalSchema>;
export type DriverStatsByCategoryDirtRoadResponse = z.infer<typeof DriverStatsByCategoryDirtRoadSchema>;

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
  DriverStatsByCategoryOvalSchema,
  DriverStatsByCategorySportsCarSchema,
  DriverStatsByCategoryFormulaCarSchema,
  DriverStatsByCategoryRoadSchema,
  DriverStatsByCategoryDirtOvalSchema,
  DriverStatsByCategoryDirtRoadSchema,
};