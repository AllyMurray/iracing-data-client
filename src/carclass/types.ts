import * as z from "zod/mini";

// ---- Common Schemas ----

const CarInClassSchema = z.object({
  carDirpath: z.string(), // maps from: car_dirpath
  carId: z.number(), // maps from: car_id
  rainEnabled: z.boolean(), // maps from: rain_enabled
  retired: z.boolean()
});

// ---- Response Schemas ----

const CarclassGetSchema = z.array(z.object({
  carClassId: z.number(),
  carsInClass: z.array(z.object({
    carDirpath: z.string(),
    carId: z.number(),
    rainEnabled: z.boolean(),
    retired: z.boolean()
  })),
  custId: z.number(),
  name: z.string(),
  rainEnabled: z.boolean(),
  relativeSpeed: z.number(),
  shortName: z.string()
}));

// ---- Response Types (inferred from schemas) ----

export type CarclassGetResponse = z.infer<typeof CarclassGetSchema>;

// ---- Parameter Schemas ----

const CarclassGetParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type CarclassGetParams = z.infer<typeof CarclassGetParamsSchema>;

// ---- Exported Schemas ----

export {
  CarclassGetParamsSchema,
  CarclassGetSchema,
};