import * as z from "zod/mini";

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

// ---- Response Schemas ----

const ConstantsCategoriesSchema = z.array(z.object({
  label: z.string(),
  value: z.number()
}));

const ConstantsDivisionsSchema = z.array(z.object({
  label: z.string(),
  value: z.number()
}));

const ConstantsEventTypesSchema = z.array(z.object({
  label: z.string(),
  value: z.number()
}));

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
  ConstantsCategoriesSchema,
  ConstantsDivisionsSchema,
  ConstantsEventTypesSchema,
};