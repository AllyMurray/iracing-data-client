import { z } from "zod-mini";

// ---- Parameter Schemas ----

const TrackAssetsParamsSchema = z.object({
});

const TrackGetParamsSchema = z.object({
});

// ---- Exported Types ----

export type TrackAssetsParams = z.infer<typeof TrackAssetsParamsSchema>;
export type TrackGetParams = z.infer<typeof TrackGetParamsSchema>;

// ---- Exported Schemas ----

export {
  TrackAssetsParamsSchema,
  TrackGetParamsSchema,
};