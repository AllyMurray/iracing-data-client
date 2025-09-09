import { z } from "zod-mini";

// ---- Parameter Schemas ----

const HostedCombinedSessionsParamsSchema = z.object({
  package_id: z.number().optional(), // If set, return only sessions using this car or track package ID.
});

const HostedSessionsParamsSchema = z.object({
});

// ---- Exported Types ----

export type HostedCombinedSessionsParams = z.infer<typeof HostedCombinedSessionsParamsSchema>;
export type HostedSessionsParams = z.infer<typeof HostedSessionsParamsSchema>;

// ---- Exported Schemas ----

export {
  HostedCombinedSessionsParamsSchema,
  HostedSessionsParamsSchema,
};