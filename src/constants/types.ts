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

// ---- Parameter Validators ----

const constantsCategoriesParams = z.object({
});

const constantsDivisionsParams = z.object({
});

const constantsEventTypesParams = z.object({
});

// ---- Exported Parameter Types ----

export type ConstantsCategoriesParams = z.infer<typeof constantsCategoriesParams>;
export type ConstantsDivisionsParams = z.infer<typeof constantsDivisionsParams>;
export type ConstantsEventTypesParams = z.infer<typeof constantsEventTypesParams>;

// ---- Exported Schemas ----

export {
  ConstantsCategories,
  ConstantsDivisions,
  ConstantsEventTypes,
};