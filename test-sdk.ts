#!/usr/bin/env tsx
import * as dotenv from "dotenv";
import { IRacingSDK, IRacingError } from "./src/index.ts";

// Load environment variables
dotenv.config();

async function testSDK() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  if (!email || !password) {
    console.error("❌ Missing EMAIL or PASSWORD in .env file");
    process.exit(1);
  }

  console.log("🏁 Testing iRacing SDK...");
  console.log(`📧 Using email: ${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);

  try {
    // Initialize the SDK
    const sdk = new IRacingSDK({
      email,
      password,
    });

    console.log("🔐 Authenticating...");

    // Test a simple endpoint - get constants categories
    console.log("📊 Fetching constants categories...");
    const categories = await sdk.constants.categories();
    
    console.log("✅ Success! Got categories:");
    console.log(`   Found ${Array.isArray(categories) ? categories.length : 'unknown count'} categories`);
    
    if (Array.isArray(categories) && categories.length > 0) {
      console.log("   First few categories:");
      categories.slice(0, 5).forEach((cat: any, index: number) => {
        console.log(`   ${index + 1}. ${cat.label || cat.name || JSON.stringify(cat).substring(0, 50)}`);
      });
    }

    // Test another endpoint - get car data
    console.log("\n🏎️  Fetching car data...");
    const cars = await sdk.car.get();
    
    console.log("✅ Success! Got cars:");
    console.log(`   Found ${Array.isArray(cars) ? cars.length : 'unknown count'} cars`);
    
    if (Array.isArray(cars) && cars.length > 0) {
      console.log("   First few cars:");
      cars.slice(0, 3).forEach((car: any, index: number) => {
        console.log(`   ${index + 1}. ${car.carName || car.name || JSON.stringify(car).substring(0, 50)}`);
      });
    }

    console.log("\n🎉 SDK test completed successfully!");

  } catch (error) {
    if (error instanceof IRacingError) {
      if (error.isMaintenanceMode) {
        console.log("🔧 iRacing is in maintenance mode");
        console.log(`   ${error.message}`);
        console.log("   ⏰ Try again later when maintenance is complete");
        return; // Don't exit with error for maintenance
      } else if (error.isRateLimited) {
        console.error("🚫 Rate limited:", error.message);
      } else if (error.isUnauthorized) {
        console.error("🔒 Authentication failed:", error.message);
      } else {
        console.error("❌ iRacing API Error:", error.message);
        console.error(`   Status: ${error.status} ${error.statusText}`);
      }
    } else {
      console.error("💥 Unexpected error:", error);
    }
    process.exit(1);
  }
}

// Run the test
testSDK().catch(error => {
  console.error("🚨 Fatal error:", error);
  process.exit(1);
});