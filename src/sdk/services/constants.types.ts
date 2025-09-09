import * as z from "zod-mini";

// ---- Response Types ----

export interface ConstantsCategoriesItem {
  label: string;
  value: number;
}

export type ConstantsCategoriesResponse = ConstantsCategoriesItem[];

export interface ConstantsDivisionsItem {
  label: string;
  value: number;
}

export type ConstantsDivisionsResponse = ConstantsDivisionsItem[];

export interface ConstantsEventTypesItem {
  label: string;
  value: number;
}

export type ConstantsEventTypesResponse = ConstantsEventTypesItem[];

// ---- Parameter Schemas ----

const ConstantsCategoriesParamsSchema = z.object({
});

const ConstantsDivisionsParamsSchema = z.object({
});

const ConstantsEventTypesParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type ConstantsCategoriesParams = z.infer<typeof ConstantsCategoriesParamsSchema>;
export type ConstantsDivisionsParams = z.infer<typeof ConstantsDivisionsParamsSchema>;
export type ConstantsEventTypesParams = z.infer<typeof ConstantsEventTypesParamsSchema>;

// ---- Exported Schemas ----

export {
  ConstantsCategoriesParamsSchema,
  ConstantsDivisionsParamsSchema,
  ConstantsEventTypesParamsSchema,
};