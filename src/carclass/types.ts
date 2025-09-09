import * as z from "zod/mini";

// ---- Response Types ----

export interface CarclassGetItem {
  carClassId: number; // maps from: car_class_id
  carsInClass: Array<any>; // maps from: cars_in_class
  custId: number; // maps from: cust_id
  name: string;
  rainEnabled: boolean; // maps from: rain_enabled
  relativeSpeed: number; // maps from: relative_speed
  shortName: string; // maps from: short_name
}

export type CarclassGetResponse = Array<CarclassGetItem>;

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