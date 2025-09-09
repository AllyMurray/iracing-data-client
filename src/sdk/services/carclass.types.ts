import { z } from "zod-mini";

// ---- Parameter Schemas ----

const CarclassGetParamsSchema = z.object({
});

// ---- Exported Types ----

export type CarclassGetParams = z.infer<typeof CarclassGetParamsSchema>;

// ---- Exported Schemas ----

export {
  CarclassGetParamsSchema,
};