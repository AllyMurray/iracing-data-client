import * as z from "zod/mini";

// ---- Response Types ----

export interface CarclassGetItem {
  carClassId: number; // maps from: car_class_id
  carsInClass: any[]; // maps from: cars_in_class
  custId: number; // maps from: cust_id
  name: string;
  rainEnabled: boolean; // maps from: rain_enabled
  relativeSpeed: number; // maps from: relative_speed
  shortName: string; // maps from: short_name
}

export type CarclassGetResponse = CarclassGetItem[];

// ---- Parameter Schemas ----

const CarclassGetParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type CarclassGetParams = z.infer<typeof CarclassGetParamsSchema>;

// ---- Exported Schemas ----

export {
  CarclassGetParamsSchema,
};