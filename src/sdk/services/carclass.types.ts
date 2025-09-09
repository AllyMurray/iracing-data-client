import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const CarclassGetParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type CarclassGetParams = z.infer<typeof CarclassGetParamsSchema>;

// ---- Exported Schemas ----

export {
  CarclassGetParamsSchema,
};