import * as z from "zod-mini";

// ---- Response Types ----

export interface HostedCombinedSessionsResponse {
  subscribed: boolean;
  sequence: number;
  sessions: any[];
  success: boolean;
}

export interface HostedSessionsResponse {
  subscribed: boolean;
  sessions: any[];
  success: boolean;
}

// ---- Parameter Schemas ----

const HostedCombinedSessionsParamsSchema = z.object({
  packageId: z.optional(z.number()), // If set, return only sessions using this car or track package ID. // maps to: package_id
});

const HostedSessionsParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type HostedCombinedSessionsParams = z.infer<typeof HostedCombinedSessionsParamsSchema>;
export type HostedSessionsParams = z.infer<typeof HostedSessionsParamsSchema>;

// ---- Exported Schemas ----

export {
  HostedCombinedSessionsParamsSchema,
  HostedSessionsParamsSchema,
};