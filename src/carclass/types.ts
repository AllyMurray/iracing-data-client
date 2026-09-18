import * as z from 'zod/mini';

// ---- Response Schemas ----

const CarclassGet = z.array(
  z.object({
    carClassId: z.number(),
    carsInClass: z.array(
      z.object({
        carDirpath: z.string(),
        carId: z.number(),
        rainEnabled: z.boolean(),
        retired: z.boolean(),
      }),
    ),
    custId: z.number(),
    name: z.string(),
    rainEnabled: z.boolean(),
    relativeSpeed: z.number(),
    shortName: z.string(),
  }),
);

// ---- Response Types (inferred from schemas) ----

export type CarclassGetResponse = z.infer<typeof CarclassGet>;

// ---- Parameter Validators ----

const carclassGetParams = z.object({});

// ---- Exported Parameter Types ----

export type CarclassGetParams = z.infer<typeof carclassGetParams>;

// ---- Exported Schemas ----

export { CarclassGet };
