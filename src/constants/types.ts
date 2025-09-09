import * as z from "zod/mini";

// ---- Response Schemas ----

const ConstantsCategories = z.array(z.object({
  label: z.string(),
  value: z.number()
}));
const ConstantsDivisions = z.array(z.object({
  label: z.string(),
  value: z.number()
}));
const ConstantsEventTypes = z.array(z.object({
  label: z.string(),
  value: z.number()
}));

// ---- Response Types (inferred from schemas) ----

export type ConstantsCategoriesResponse = z.infer<typeof ConstantsCategories>;
export type ConstantsDivisionsResponse = z.infer<typeof ConstantsDivisions>;
export type ConstantsEventTypesResponse = z.infer<typeof ConstantsEventTypes>;

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
  ConstantsCategories,
  ConstantsDivisions,
  ConstantsEventTypes,
};