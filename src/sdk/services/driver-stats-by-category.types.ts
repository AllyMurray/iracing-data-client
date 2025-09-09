import * as z from "zod/mini";

// ---- Response Types ----

export interface DriverStatsByCategoryOvalResponse {
  _contentType: "csv";
  _rawData: string;
  _note: string;
}

export interface DriverStatsByCategorySportsCarResponse {
  _contentType: "csv";
  _rawData: string;
  _note: string;
}

export interface DriverStatsByCategoryFormulaCarResponse {
  _contentType: "csv";
  _rawData: string;
  _note: string;
}

export interface DriverStatsByCategoryRoadResponse {
  _contentType: "csv";
  _rawData: string;
  _note: string;
}

export interface DriverStatsByCategoryDirtOvalResponse {
  _contentType: "csv";
  _rawData: string;
  _note: string;
}

export interface DriverStatsByCategoryDirtRoadResponse {
  _contentType: "csv";
  _rawData: string;
  _note: string;
}

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
};