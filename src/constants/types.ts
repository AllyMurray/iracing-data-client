import * as z from "zod/mini";

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

// ---- Response Types (inferred from schemas) ----

export type ConstantsCategoriesResponse = z.infer<typeof ConstantsCategoriesSchema>;
export type ConstantsDivisionsResponse = z.infer<typeof ConstantsDivisionsSchema>;
export type ConstantsEventTypesResponse = z.infer<typeof ConstantsEventTypesSchema>;

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