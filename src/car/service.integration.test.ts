import * as dotenv from "dotenv";
import { describe, it, expect, beforeAll } from "vitest";
import { IRacingSDK } from "../index";
import type { CarAssetsResponse, CarGetResponse } from "./types";

// Load environment variables
dotenv.config();

describe.skip("CarService Integration Tests", () => {
  let sdk: IRacingSDK;

  beforeAll(() => {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!email || !password) {
      throw new Error("Missing EMAIL or PASSWORD in .env file");
    }

    sdk = new IRacingSDK({
      email,
      password,
    });
  });

  describe("car.get()", () => {
    it("should return an array of cars with required fields", async () => {
      const cars = await sdk.car.get();

      expect(Array.isArray(cars)).toBe(true);
      expect(cars.length).toBeGreaterThan(0);

      const firstCar = cars[0];

      // Should always be camelCase now thanks to our client transformation
      expect(firstCar).toHaveProperty('carId');
      expect(firstCar).toHaveProperty('carName');
      expect(firstCar).toHaveProperty('carNameAbbreviated');
      expect(firstCar).toHaveProperty('aiEnabled');
      expect(firstCar).toHaveProperty('allowNumberColors');

      expect(typeof firstCar.carId).toBe('number');
      expect(typeof firstCar.carName).toBe('string');
      expect(typeof firstCar.carNameAbbreviated).toBe('string');
      expect(typeof firstCar.aiEnabled).toBe('boolean');
      expect(typeof firstCar.allowNumberColors).toBe('boolean');
    }, 30000); // 30 second timeout for API call
  });

  describe("car.assets()", () => {
    it("should return an object of car assets with required fields", async () => {
      const assets = await sdk.car.assets();

      expect(typeof assets).toBe('object');
      expect(Array.isArray(assets)).toBe(false);

      const assetKeys = Object.keys(assets);
      expect(assetKeys.length).toBeGreaterThan(0);

      const firstAssetKey = assetKeys[0];
      const firstAsset = assets[firstAssetKey];

      // Should always be camelCase now thanks to our client transformation
      expect(firstAsset).toHaveProperty('carId');
      expect(firstAsset).toHaveProperty('folder');
      expect(firstAsset).toHaveProperty('logo');
      expect(firstAsset).toHaveProperty('smallImage');
      expect(firstAsset).toHaveProperty('largeImage');

      expect(typeof firstAsset.carId).toBe('number');
      expect(typeof firstAsset.folder).toBe('string');
      expect(typeof firstAsset.logo).toBe('string');
      expect(typeof firstAsset.smallImage).toBe('string');
      expect(typeof firstAsset.largeImage).toBe('string');
    }, 30000); // 30 second timeout for API call
  });

  describe("cross-validation", () => {
    it("should be able to call both methods successfully", async () => {
      // Just test that both calls work without timing out
      // We'll get the actual data structure from the individual tests above
      const carsPromise = sdk.car.get();
      const assetsPromise = sdk.car.assets();

      const [cars, assets] = await Promise.all([carsPromise, assetsPromise]);

      expect(Array.isArray(cars)).toBe(true);
      expect(typeof assets).toBe('object');
      expect(cars.length).toBeGreaterThan(0);
      expect(Object.keys(assets).length).toBeGreaterThan(0);
    }, 45000); // 45 second timeout for both API calls
  });
});