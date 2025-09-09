import { z } from "zod-mini";

// ---- Parameter Schemas ----

const CarAssetsParamsSchema = z.object({
});

const CarGetParamsSchema = z.object({
});

// ---- Exported Types ----

export type CarAssetsParams = z.infer<typeof CarAssetsParamsSchema>;
export type CarGetParams = z.infer<typeof CarGetParamsSchema>;

// ---- Exported Schemas ----

export {
  CarAssetsParamsSchema,
  CarGetParamsSchema,
};