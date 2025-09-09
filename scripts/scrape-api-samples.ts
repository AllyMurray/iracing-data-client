#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

/** ---- Input types (from your index JSON) ---- */
type ParamType = "string" | "number" | "boolean" | "numbers";
type ParamDef = { type: ParamType; required?: boolean; note?: string };
type Endpoint = { link: string; parameters?: Record<string, ParamDef> };
type Section = Record<string, Endpoint | Record<string, Endpoint>>;
type Root = Record<string, Section>;

/** ---- Authentication Response ---- */
interface AuthResponse {
  authcode: string;
  autoLoginSeries: null | string;
  autoLoginToken: null | string;
  custId: number;
  email: string;
  ssoCookieDomain: string;
  ssoCookieName: string;
  ssoCookiePath: string;
  ssoCookieValue: string;
}

interface S3Response {
  link: string;
  expires: string;
}

/** ---- CLI args ---- */
const INPUT = process.argv[2] ?? "docs/api/index.json";
const SAMPLES_DIR = process.argv[3] ?? "samples";

const index: Root = JSON.parse(fs.readFileSync(INPUT, "utf8"));

/** ---- iRacing Client ---- */
class IRacingScraperClient {
  private baseUrl = "https://members-ng.iracing.com";
  private authData: AuthResponse | null = null;
  private cookies: Record<string, string> | null = null;
  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, value.join(","));
          } else if (typeof value === "boolean") {
            url.searchParams.append(key, value ? "true" : "false");
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }
    
    return url.toString();
  }

  async authenticate(): Promise<void> {
    console.log("🔐 Authenticating with iRacing...");
    
    const response = await fetch(`${this.baseUrl}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email: this.email, 
        password: this.password 
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Authentication failed: ${response.statusText} - ${text}`);
    }

    this.authData = await response.json();
    
    // Parse and store cookies
    if (!this.authData) {
      throw new Error('Authentication failed - no auth data received');
    }
    
    this.cookies = {
      "irsso_membersv2": this.authData.ssoCookieValue,
      "authtoken_members": `%7B%22authtoken%22%3A%7B%22authcode%22%3A%22${this.authData.authcode}%22%2C%22email%22%3A%22${encodeURIComponent(this.authData.email)}%22%7D%7D`
    };
    
    console.log(`✅ Authenticated as customer ID: ${this.authData.custId}`);
  }

  async fetchEndpoint(url: string, params?: Record<string, any>): Promise<any> {
    if (!this.cookies) {
      throw new Error("Not authenticated");
    }

    const fullUrl = this.buildUrl(url, params);
    
    // Set all cookies in the Cookie header
    const cookieString = Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");

    const response = await fetch(fullUrl, {
      headers: {
        "Cookie": cookieString,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`);
    }

    const contentType = response.headers.get("content-type") || "";
    
    // Check if this is a direct JSON response (some endpoints don't use S3)
    if (contentType.includes("application/json")) {
      const data = await response.json();
      
      // Check if it's an S3 link response
      if (data.link && data.expires) {
        // Fetch the actual data from S3
        const s3Response = await fetch(data.link);
        if (!s3Response.ok) {
          throw new Error(`Failed to fetch from S3: ${s3Response.statusText}`);
        }
        
        // Check content type of S3 response
        const s3ContentType = s3Response.headers.get("content-type") || "";
        if (s3ContentType.includes("text/csv") || s3ContentType.includes("text/plain")) {
          // Return CSV as raw text wrapped in an object
          const csvText = await s3Response.text();
          return { 
            _contentType: "csv", 
            _rawData: csvText,
            _note: "This endpoint returns CSV data, not JSON" 
          };
        }
        
        return s3Response.json();
      }
      
      return data;
    }

    throw new Error(`Unexpected content type: ${contentType}`);
  }

  getCustomerId(): number {
    return this.authData?.custId || 0;
  }
}

/** ---- Helper to flatten endpoints ---- */
type FlatEndpoint = {
  section: string;
  name: string;
  fullName: string;  // section.name
  url: string;
  params: Record<string, ParamDef>;
};

function isEndpoint(x: any): x is Endpoint {
  return x && typeof x === "object" && typeof x.link === "string";
}

function flattenEndpoints(root: Root): FlatEndpoint[] {
  const endpoints: FlatEndpoint[] = [];
  
  for (const [sectionName, section] of Object.entries(root)) {
    for (const [key, val] of Object.entries(section)) {
      if (isEndpoint(val)) {
        endpoints.push({
          section: sectionName,
          name: key,
          fullName: `${sectionName}.${key}`,
          url: val.link,
          params: val.parameters || {},
        });
      } else if (val && typeof val === "object") {
        for (const [k2, v2] of Object.entries(val)) {
          if (isEndpoint(v2)) {
            endpoints.push({
              section: sectionName,
              name: `${key}.${k2}`,
              fullName: `${sectionName}.${key}.${k2}`,
              url: v2.link,
              params: v2.parameters || {},
            });
          }
        }
      }
    }
  }
  
  return endpoints;
}

/** ---- Generate sample parameters for an endpoint ---- */
function generateSampleParams(params: Record<string, ParamDef>, custId: number): Record<string, any> {
  const sampleParams: Record<string, any> = {};
  
  for (const [paramName, paramDef] of Object.entries(params)) {
    // Skip optional parameters to get minimal response
    if (!paramDef.required) {
      continue;
    }
    
    // Generate sample values based on parameter name and type
    switch (paramDef.type) {
      case "number":
        // Use actual IDs where possible
        if (paramName === "cust_id" || paramName === "customer_id") {
          sampleParams[paramName] = custId;
        } else if (paramName.includes("_id")) {
          sampleParams[paramName] = 1; // Default ID
        } else if (paramName === "season_year") {
          sampleParams[paramName] = new Date().getFullYear();
        } else if (paramName === "season_quarter") {
          sampleParams[paramName] = Math.ceil((new Date().getMonth() + 1) / 3);
        } else {
          sampleParams[paramName] = 1;
        }
        break;
        
      case "string":
        if (paramName === "finish_range_begin") {
          sampleParams[paramName] = "1";
        } else if (paramName === "finish_range_end") {
          sampleParams[paramName] = "10";
        } else if (paramName.includes("date") || paramName === "from") {
          // Use recent date
          const date = new Date();
          date.setDate(date.getDate() - 7); // 7 days ago
          sampleParams[paramName] = date.toISOString().split("T")[0];
        } else {
          sampleParams[paramName] = "sample";
        }
        break;
        
      case "boolean":
        sampleParams[paramName] = true;
        break;
        
      case "numbers":
        sampleParams[paramName] = [1];
        break;
    }
  }
  
  return sampleParams;
}

/** ---- Main scraper ---- */
async function scrapeApiSamples() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  
  if (!email || !password) {
    throw new Error("EMAIL and PASSWORD must be set in .env file");
  }
  
  // Create samples directory
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
  
  // Initialize client and authenticate
  const client = new IRacingScraperClient(email, password);
  await client.authenticate();
  
  const custId = client.getCustomerId();
  const endpoints = flattenEndpoints(index);
  
  console.log(`\n📊 Found ${endpoints.length} endpoints to scrape\n`);
  
  const results = {
    success: [] as string[],
    failed: [] as { endpoint: string; error: string }[],
    skipped: [] as string[],
  };
  
  // Process endpoints with rate limiting
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    const sampleFile = path.join(SAMPLES_DIR, `${endpoint.fullName}.json`);
    
    // Skip if sample already exists
    if (fs.existsSync(sampleFile)) {
      console.log(`⏭️  [${i + 1}/${endpoints.length}] Skipping ${endpoint.fullName} (already exists)`);
      results.skipped.push(endpoint.fullName);
      continue;
    }
    
    console.log(`🔄 [${i + 1}/${endpoints.length}] Fetching ${endpoint.fullName}...`);
    
    try {
      // Generate sample parameters
      const params = generateSampleParams(endpoint.params, custId);
      
      // Some endpoints need special handling
      if (endpoint.fullName.includes("league") && endpoint.fullName !== "league.get_points_systems") {
        // Most league endpoints need a valid league_id
        // You can set a known league ID here if you have one
        const knownLeagueId = 7058; // Example league ID
        if (params.league_id !== undefined) {
          params.league_id = knownLeagueId;
        }
        
        // Skip if still no league_id required param
        if (endpoint.params.league_id?.required && !params.league_id) {
          console.log(`   ⚠️  Skipping - requires league_id`);
          results.skipped.push(endpoint.fullName);
          continue;
        }
      }
      
      // Team endpoints might need team_id
      if (endpoint.fullName.includes("team")) {
        // Skip team endpoints that require team_id
        if (endpoint.params.team_id?.required) {
          console.log(`   ⚠️  Skipping - requires team_id`);
          results.skipped.push(endpoint.fullName);
          continue;
        }
      }
      
      // Session endpoints might need specific IDs
      if (endpoint.fullName.includes("session") && endpoint.params.subsession_id?.required) {
        // Skip endpoints requiring specific session IDs
        console.log(`   ⚠️  Skipping - requires subsession_id`);
        results.skipped.push(endpoint.fullName);
        continue;
      }
      
      // Fetch the endpoint
      const response = await client.fetchEndpoint(endpoint.url, params);
      
      // Save the response
      fs.writeFileSync(sampleFile, JSON.stringify(response, null, 2), "utf8");
      console.log(`   ✅ Saved to ${sampleFile}`);
      results.success.push(endpoint.fullName);
      
      // Rate limiting - be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error: any) {
      console.error(`   ❌ Failed: ${error.message}`);
      results.failed.push({
        endpoint: endpoint.fullName,
        error: error.message,
      });
      
      // Continue on error
      continue;
    }
  }
  
  // Summary
  console.log("\n📈 Scraping Complete!");
  console.log(`   ✅ Success: ${results.success.length}`);
  console.log(`   ⏭️  Skipped: ${results.skipped.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log("\n❌ Failed endpoints:");
    for (const failure of results.failed) {
      console.log(`   - ${failure.endpoint}: ${failure.error}`);
    }
  }
  
  // Save summary
  const summaryFile = path.join(SAMPLES_DIR, "_scrape_summary.json");
  fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2), "utf8");
  console.log(`\n📄 Summary saved to ${summaryFile}`);
}

// Run the scraper
scrapeApiSamples().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});