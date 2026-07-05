#!/usr/bin/env tsx
/**
 * Enhanced iRacing API Sample Scraper
 * 
 * This script fetches comprehensive sample data from the iRacing API to improve
 * TypeScript type generation. It generates multiple parameter variations for 
 * each endpoint to capture richer data structures.
 * 
 * Usage:
 *   npm run scrape-samples [input.json] [samples_dir] [--force] [--log-file path]
 *   
 * Environment variables required:
 *   IRACING_CLIENT_ID - OAuth client ID
 *   IRACING_CLIENT_SECRET - OAuth client secret
 *   IRACING_USERNAME - iRacing account email
 *   IRACING_PASSWORD - iRacing account password
 *
 * Optional overrides (helpful for strict full-coverage scraping):
 *   IRACING_SUBSESSION_ID - Known subsession ID for results.* endpoints
 *   IRACING_TEAM_ID - Known team ID for team.get
 *   IRACING_SEASON_ID - Known season ID for season/stat endpoints
 *   IRACING_CAR_CLASS_ID - Known car class ID for standings endpoints
 *   
 * Features:
 * - Multiple parameter variations per endpoint for richer data
 * - Automatic merging of sample variations in Data Client generation  
 * - Rate limiting to be respectful to the API
 * - Comprehensive error handling and reporting
 * - Force refresh mode to update existing samples
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { requestPasswordLimitedToken } from "../src/auth/flows/password-limited";
import { TokenManager } from "../src/auth/token-manager";


/** ---- Input types (from your index JSON) ---- */
type ParamType = "string" | "number" | "boolean" | "numbers";
type ParamDef = { type: ParamType; required?: boolean; note?: string };
type Endpoint = { link: string; parameters?: Record<string, ParamDef> };
type Section = Record<string, Endpoint | Record<string, Endpoint>>;
type Root = Record<string, Section>;

/** ---- CLI args ---- */
const CLI_ARGS = process.argv.slice(2);
const POSITIONAL_ARGS = CLI_ARGS.filter((arg) => !arg.startsWith("-"));
const INPUT = POSITIONAL_ARGS[0] ?? "docs/api/index.json";
const SAMPLES_DIR = POSITIONAL_ARGS[1] ?? "samples";
const FORCE_REFRESH = CLI_ARGS.includes("--force") || CLI_ARGS.includes("-f");
const MISSING_ONLY = CLI_ARGS.includes("--missing-only");

function resolveOnlyEndpointsArg(args: string[]): Set<string> | null {
  const inline = args.find((arg) => arg.startsWith("--only="));
  const raw = inline ? inline.slice("--only=".length) : (() => {
    const index = args.indexOf("--only");
    if (index >= 0 && args[index + 1] && !args[index + 1].startsWith("-")) {
      return args[index + 1];
    }
    return "";
  })();

  const values = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return values.length > 0 ? new Set(values) : null;
}

const ONLY_ENDPOINTS = resolveOnlyEndpointsArg(CLI_ARGS);

function resolveLogFileArg(args: string[]): string | undefined {
  const inline = args.find((arg) => arg.startsWith("--log-file="));
  if (inline) {
    return inline.slice("--log-file=".length).trim() || undefined;
  }

  const index = args.indexOf("--log-file");
  if (index >= 0 && args[index + 1] && !args[index + 1].startsWith("-")) {
    return args[index + 1];
  }

  return undefined;
}

function defaultLogFilePath(samplesDir: string): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  return path.join(samplesDir, "logs", `_scrape_log_${timestamp}.txt`);
}

function hasAnySampleForEndpoint(samplesDir: string, fullName: string): boolean {
  if (!fs.existsSync(samplesDir)) return false;
  const base = `${fullName}.json`;
  const variationPrefix = `${fullName}_var`;
  for (const file of fs.readdirSync(samplesDir)) {
    if (file === base) return true;
    if (file.startsWith(variationPrefix) && file.endsWith(".json")) return true;
  }
  return false;
}

function stringifyLogArg(arg: unknown): string {
  if (arg instanceof Error) {
    return arg.stack || `${arg.name}: ${arg.message}`;
  }
  if (typeof arg === "string") {
    return arg;
  }
  if (typeof arg === "number" || typeof arg === "boolean" || arg === null || arg === undefined) {
    return String(arg);
  }

  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

function setupDualLogging(samplesDir: string, args: string[]): { logFilePath: string; close: () => Promise<void> } {
  fs.mkdirSync(samplesDir, { recursive: true });
  const requestedPath = resolveLogFileArg(args);
  const logFilePath = requestedPath ? path.resolve(requestedPath) : defaultLogFilePath(samplesDir);
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

  const stream = fs.createWriteStream(logFilePath, { flags: "a" });
  const originalLog = console.log.bind(console);
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  const writeLine = (level: "INFO" | "WARN" | "ERROR", values: unknown[]): void => {
    const ts = new Date().toISOString();
    const message = values.map((value) => stringifyLogArg(value)).join(" ");
    stream.write(`[${ts}] [${level}] ${message}\n`);
  };

  console.log = (...values: unknown[]) => {
    originalLog(...values);
    writeLine("INFO", values);
  };

  console.warn = (...values: unknown[]) => {
    originalWarn(...values);
    writeLine("WARN", values);
  };

  console.error = (...values: unknown[]) => {
    originalError(...values);
    writeLine("ERROR", values);
  };

  originalLog(`📝 Scrape log file: ${logFilePath}`);
  writeLine("INFO", [`Scrape log file: ${logFilePath}`]);

  return {
    logFilePath,
    close: async () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      await new Promise<void>((resolve) => {
        stream.end(() => resolve());
      });
    },
  };
}

const index: Root = JSON.parse(fs.readFileSync(INPUT, "utf8"));

/** ---- iRacing Client ---- */
class IRacingScraperClient {
  private baseUrl = "https://members-ng.iracing.com";
  private customerId: number | null = null;
  private clientId: string;
  private clientSecret: string;
  private email: string;
  private password: string;
  private tokenManager: TokenManager;

  constructor(clientId: string, clientSecret: string, email: string, password: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.email = email;
    this.password = password;
    this.tokenManager = new TokenManager({
      clientId,
      clientSecret,
      fetchFn: fetch,
    });
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
    console.log("🔐 Authenticating with iRacing OAuth2 (password_limited)...");

    const tokenResponse = await requestPasswordLimitedToken({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      username: this.email,
      password: this.password,
      fetchFn: fetch,
    });
    this.tokenManager.setTokens(tokenResponse);

    const account = await this.fetchEndpoint("https://members-ng.iracing.com/data/member/info");
    const candidateCustId =
      account?.custId ??
      account?.cust_id ??
      account?.account?.custId ??
      account?.account?.cust_id ??
      account?.memberInfo?.custId ??
      account?.memberInfo?.cust_id;
    if (typeof candidateCustId === "number") {
      this.customerId = candidateCustId;
    }

    console.log(`✅ Authenticated${this.customerId ? ` as customer ID: ${this.customerId}` : ""}`);
  }

  async fetchEndpoint(url: string, params?: Record<string, any>): Promise<any> {
    if (!this.tokenManager.hasTokens()) {
      throw new Error("Not authenticated");
    }

    const accessToken = await this.tokenManager.getAccessToken();
    const fullUrl = this.buildUrl(url, params);

    const response = await fetch(fullUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
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
    return this.customerId || 0;
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

type ScrapeContext = {
  seasonIds: number[];
  raceWeekNums: number[];
  subsessionIds: number[];
  simsessionNumbers: number[];
  carClassIds: number[];
  teamIds: number[];
  custIds: number[];
  seasonCarClassPairs: Array<{ seasonId: number; carClassId: number }>;
  teamSeasonCarClassPairs: Array<{ seasonId: number; carClassId: number }>;
  lapDataCandidates: Array<{ subsessionId: number; simsessionNumber: number; custId?: number; teamId?: number }>;
};

function addSeasonCarClassPair(context: ScrapeContext, seasonId: unknown, carClassId: unknown): void {
  if (typeof seasonId !== "number" || typeof carClassId !== "number") return;
  if (!Number.isFinite(seasonId) || !Number.isFinite(carClassId)) return;
  if (seasonId <= 0 || carClassId <= 0) return;
  context.seasonCarClassPairs.push({ seasonId, carClassId });
}

function choosePreferredSeasonCarClassPair(context: ScrapeContext): { seasonId: number; carClassId: number } | undefined {
  const candidates = context.seasonCarClassPairs.filter((pair) => pair.seasonId > 100 && pair.seasonId < 20000 && pair.carClassId > 0);
  if (candidates.length === 0) return undefined;

  const counts = new Map<string, number>();
  for (const pair of candidates) {
    const key = `${pair.seasonId}|${pair.carClassId}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const ranked = [...counts.entries()]
    .map(([key, count]) => {
      const [seasonId, carClassId] = key.split("|").map(Number);
      return { seasonId, carClassId, count };
    })
    .sort((a, b) => (b.count - a.count) || (b.seasonId - a.seasonId));

  const top = ranked[0];
  return top ? { seasonId: top.seasonId, carClassId: top.carClassId } : undefined;
}

function choosePreferredTeamSeasonCarClassPair(context: ScrapeContext): { seasonId: number; carClassId: number } | undefined {
  const candidates = context.teamSeasonCarClassPairs.filter((pair) => pair.seasonId > 100 && pair.seasonId < 20000 && pair.carClassId > 0);
  if (candidates.length === 0) return undefined;

  const counts = new Map<string, number>();
  for (const pair of candidates) {
    const key = `${pair.seasonId}|${pair.carClassId}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const ranked = [...counts.entries()]
    .map(([key, count]) => {
      const [seasonId, carClassId] = key.split("|").map(Number);
      return { seasonId, carClassId, count };
    })
    .sort((a, b) => (b.count - a.count) || (b.seasonId - a.seasonId));

  const top = ranked[0];
  return top ? { seasonId: top.seasonId, carClassId: top.carClassId } : undefined;
}

function topTeamSeasonCarClassPairs(context: ScrapeContext, limit: number): Array<{ seasonId: number; carClassId: number }> {
  const candidates = context.teamSeasonCarClassPairs.filter((pair) => pair.seasonId > 100 && pair.seasonId < 20000 && pair.carClassId > 0);
  if (candidates.length === 0) return [];

  const counts = new Map<string, number>();
  for (const pair of candidates) {
    const key = `${pair.seasonId}|${pair.carClassId}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([key, count]) => {
      const [seasonId, carClassId] = key.split("|").map(Number);
      return { seasonId, carClassId, count };
    })
    .sort((a, b) => (b.count - a.count) || (b.seasonId - a.seasonId))
    .slice(0, limit)
    .map((item) => ({ seasonId: item.seasonId, carClassId: item.carClassId }));
}

function choosePreferredId(values: number[], kind: "season" | "subsession" | "carClass" | "team"): number | undefined {
  const unique = [...new Set(values)].filter((value) => Number.isFinite(value));
  if (unique.length === 0) return undefined;

  switch (kind) {
    case "season": {
      const candidates = unique.filter((value) => value > 100 && value < 20000);
      return candidates.at(-1);
    }
    case "subsession": {
      const candidates = unique.filter((value) => value > 100000);
      return candidates.at(-1);
    }
    case "carClass": {
      const candidates = unique.filter((value) => value > 0);
      return candidates.at(-1);
    }
    case "team": {
      const candidates = unique.filter((value) => value !== -1 && value !== 0);
      return candidates.at(-1);
    }
  }
}

function applyContextToParams(endpoint: FlatEndpoint, params: Record<string, any>, context: ScrapeContext, custId: number): Record<string, any> {
  const mapped = { ...params };

  if (mapped.cust_id === undefined) {
    mapped.cust_id = custId;
  }

  const seasonId = choosePreferredId(context.seasonIds, "season");
  const subsessionId = choosePreferredId(context.subsessionIds, "subsession");
  const carClassId = choosePreferredId(context.carClassIds, "carClass");
  const seasonCarClassPair = choosePreferredSeasonCarClassPair(context);
  const teamId = choosePreferredId(context.teamIds, "team");
  const raceWeekNum = context.raceWeekNums[0] ?? 0;

  if (
    seasonCarClassPair &&
    mapped.season_id !== undefined &&
    mapped.car_class_id !== undefined
  ) {
    mapped.season_id = seasonCarClassPair.seasonId;
    mapped.car_class_id = seasonCarClassPair.carClassId;
  }

  if (mapped.season_id === undefined && endpoint.params.season_id && seasonId !== undefined) {
    mapped.season_id = seasonId;
  }
  if (mapped.subsession_id === undefined && endpoint.params.subsession_id && subsessionId !== undefined) {
    mapped.subsession_id = subsessionId;
  }
  if (mapped.car_class_id === undefined && endpoint.params.car_class_id && carClassId !== undefined) {
    mapped.car_class_id = carClassId;
  }
  if (mapped.team_id === undefined && endpoint.params.team_id && teamId !== undefined) {
    mapped.team_id = teamId;
  }
  if (mapped.race_week_num === undefined && endpoint.params.race_week_num) {
    mapped.race_week_num = raceWeekNum;
  }

  return mapped;
}

async function bootstrapContext(client: IRacingScraperClient, context: ScrapeContext): Promise<void> {
  const seeds: Array<{ name: string; url: string; params?: Record<string, any> }> = [
    { name: "member.info", url: "https://members-ng.iracing.com/data/member/info" },
    { name: "season.spectator_subsessionids", url: "https://members-ng.iracing.com/data/season/spectator_subsessionids" },
    { name: "season.spectator_subsessionids_detail", url: "https://members-ng.iracing.com/data/season/spectator_subsessionids_detail" },
    { name: "team.membership", url: "https://members-ng.iracing.com/data/team/membership" },
    {
      name: "season.list",
      url: "https://members-ng.iracing.com/data/season/list",
      params: {
        season_year: new Date().getFullYear(),
        season_quarter: Math.ceil((new Date().getMonth() + 1) / 3),
      },
    },
    { name: "series.seasons", url: "https://members-ng.iracing.com/data/series/seasons" },
  ];

  console.log("\n🧭 Bootstrapping context IDs from seed endpoints...");
  for (const seed of seeds) {
    try {
      const response = await client.fetchEndpoint(seed.url, seed.params);
      collectContextFromValue(response, context);
      console.log(`   ✅ Seeded from ${seed.name}`);
    } catch (error: any) {
      console.warn(`   ⚠️  Seed ${seed.name} failed: ${error?.message || String(error)}`);
    }
  }

  console.log(
    `   • seasonIds=${context.seasonIds.length}, subsessionIds=${context.subsessionIds.length}, carClassIds=${context.carClassIds.length}, teamIds=${context.teamIds.length}, seasonCarClassPairs=${context.seasonCarClassPairs.length}`
  );

  const preferredPair = choosePreferredSeasonCarClassPair(context);
  if (preferredPair) {
    console.log(`   • preferred season/class pair: ${preferredPair.seasonId}/${preferredPair.carClassId}`);
  }
  const preferredTeamPair = choosePreferredTeamSeasonCarClassPair(context);
  if (preferredTeamPair) {
    console.log(`   • preferred TEAM season/class pair: ${preferredTeamPair.seasonId}/${preferredTeamPair.carClassId}`);
  }
}

function sortEndpointsForDependencies(endpoints: FlatEndpoint[]): FlatEndpoint[] {
  const priority = new Map<string, number>([
    ["member.info", 0],
    ["season.spectator_subsessionids", 0],
    ["season.spectator_subsessionids_detail", 0],
    ["team.membership", 0],
    ["season.list", 0],
    ["series.seasons", 0],
    ["results.get", 10],
    ["results.event_log", 10],
    ["results.lap_chart_data", 10],
    ["results.lap_data", 10],
    ["series.season_schedule", 10],
    ["stats.season_driver_standings", 10],
    ["stats.season_supersession_standings", 10],
    ["stats.season_team_standings", 10],
    ["stats.season_tt_standings", 10],
    ["stats.season_tt_results", 10],
    ["stats.season_qualify_results", 10],
    ["team.get", 10],
  ]);

  return [...endpoints].sort((a, b) => {
    const pa = priority.get(a.fullName) ?? 5;
    const pb = priority.get(b.fullName) ?? 5;
    if (pa !== pb) return pa - pb;
    return a.fullName.localeCompare(b.fullName);
  });
}

function isTransientHttpError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Request failed: 502") ||
    message.includes("Request failed: 503") ||
    message.includes("Request failed: 504")
  );
}

async function fetchWithRetry(
  client: IRacingScraperClient,
  url: string,
  params: Record<string, any>,
  maxAttempts: number = 3
): Promise<any> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await client.fetchEndpoint(url, params);
    } catch (error) {
      lastError = error;
      if (!isTransientHttpError(error) || attempt === maxAttempts) {
        throw error;
      }

      const backoffMs = 500 * attempt;
      console.warn(`   🔁 Transient error, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxAttempts})`);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

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

function addUnique(target: number[], value: unknown): void {
  if (typeof value !== "number" || Number.isNaN(value)) return;
  if (!target.includes(value)) target.push(value);
}

function preferUnique(target: number[], value: unknown): void {
  if (typeof value !== "number" || Number.isNaN(value)) return;

  const existingIndex = target.indexOf(value);
  if (existingIndex >= 0) target.splice(existingIndex, 1);
  target.push(value);
}

function collectContextFromValue(value: unknown, context: ScrapeContext, inheritedSeasonId?: number): void {
  if (value === null || value === undefined) return;

  if (Array.isArray(value)) {
    for (const item of value) {
      collectContextFromValue(item, context, inheritedSeasonId);
    }
    return;
  }

  if (typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  const currentSeasonId = typeof record.season_id === "number" ? record.season_id : inheritedSeasonId;

  if (typeof record.subsession_id === "number" && Array.isArray(record.session_results)) {
    for (const session of record.session_results) {
      if (!session || typeof session !== "object") continue;
      const simsessionNumber = typeof (session as any).simsession_number === "number" ? (session as any).simsession_number : 0;
      const rows = Array.isArray((session as any).results) ? (session as any).results : [];

      if (rows.length === 0) {
        context.lapDataCandidates.push({ subsessionId: record.subsession_id, simsessionNumber });
        continue;
      }

      for (const row of rows) {
        if (!row || typeof row !== "object") continue;
        const custId = typeof (row as any).cust_id === "number" ? (row as any).cust_id : undefined;
        const teamId = typeof (row as any).team_id === "number" && (row as any).team_id > 0 ? (row as any).team_id : undefined;
        context.lapDataCandidates.push({ subsessionId: record.subsession_id, simsessionNumber, custId, teamId });
      }
    }
  }

  if (currentSeasonId !== undefined) {
    if (typeof record.car_class_id === "number") {
      addSeasonCarClassPair(context, currentSeasonId, record.car_class_id);
    }
    if (Array.isArray(record.car_class_ids)) {
      for (const carClassId of record.car_class_ids) {
        addSeasonCarClassPair(context, currentSeasonId, carClassId);
      }
    }
    if (Array.isArray(record.race_week_car_class_ids)) {
      for (const carClassId of record.race_week_car_class_ids) {
        addSeasonCarClassPair(context, currentSeasonId, carClassId);
      }
    }
  }

  if (currentSeasonId !== undefined && typeof record.max_team_drivers === "number" && record.max_team_drivers > 1) {
    if (typeof record.car_class_id === "number") {
      context.teamSeasonCarClassPairs.push({ seasonId: currentSeasonId, carClassId: record.car_class_id });
    }
    if (Array.isArray(record.car_class_ids)) {
      for (const carClassId of record.car_class_ids) {
        if (typeof carClassId === "number") {
          context.teamSeasonCarClassPairs.push({ seasonId: currentSeasonId, carClassId });
        }
      }
    }
    if (Array.isArray(record.race_week_car_class_ids)) {
      for (const carClassId of record.race_week_car_class_ids) {
        if (typeof carClassId === "number") {
          context.teamSeasonCarClassPairs.push({ seasonId: currentSeasonId, carClassId });
        }
      }
    }
  }

  for (const [key, field] of Object.entries(record)) {
    if (key === "cust_id") addUnique(context.custIds, field);
    if (key === "season_id") addUnique(context.seasonIds, field);
    if (key === "race_week_num") addUnique(context.raceWeekNums, field);
    if (key === "subsession_id") addUnique(context.subsessionIds, field);
    if (key === "simsession_number") addUnique(context.simsessionNumbers, field);
    if (key === "car_class_id") addUnique(context.carClassIds, field);
    if (key === "team_id") addUnique(context.teamIds, field);

    if (key === "season_ids" && Array.isArray(field)) {
      for (const id of field) addUnique(context.seasonIds, id);
    }
    if (key === "subsession_ids" && Array.isArray(field)) {
      for (const id of field) addUnique(context.subsessionIds, id);
    }
    if (key === "car_class_ids" && Array.isArray(field)) {
      for (const id of field) addUnique(context.carClassIds, id);
    }
    if (key === "cust_ids" && Array.isArray(field)) {
      for (const id of field) addUnique(context.custIds, id);
    }

    collectContextFromValue(field, context, currentSeasonId);
  }
}

function loadContextFromExistingSamples(samplesDir: string): ScrapeContext {
  const context: ScrapeContext = {
    seasonIds: [],
    raceWeekNums: [],
    subsessionIds: [],
    simsessionNumbers: [0],
    carClassIds: [],
    teamIds: [],
    custIds: [],
    seasonCarClassPairs: [],
    teamSeasonCarClassPairs: [],
    lapDataCandidates: [],
  };

  if (!fs.existsSync(samplesDir)) {
    return context;
  }

  const files = fs.readdirSync(samplesDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    try {
      const parsed = JSON.parse(fs.readFileSync(path.join(samplesDir, file), "utf8"));
      collectContextFromValue(parsed, context);
    } catch {
      // Ignore malformed/partial files
    }
  }

  // Optional explicit overrides for hard-to-discover IDs
  if (process.env.IRACING_TEAM_ID) addUnique(context.teamIds, Number(process.env.IRACING_TEAM_ID));
  if (process.env.IRACING_SUBSESSION_ID) addUnique(context.subsessionIds, Number(process.env.IRACING_SUBSESSION_ID));
  if (process.env.IRACING_SEASON_ID) addUnique(context.seasonIds, Number(process.env.IRACING_SEASON_ID));
  if (process.env.IRACING_CAR_CLASS_ID) addUnique(context.carClassIds, Number(process.env.IRACING_CAR_CLASS_ID));

  return context;
}

/** ---- Generate sample parameters for an endpoint ---- */
function generateSampleParams(params: Record<string, ParamDef>, custId: number, includeOptional: boolean = false): Record<string, any> {
  const sampleParams: Record<string, any> = {};
  const now = new Date();
  const recentIso = new Date(now.getTime() - (includeOptional ? 14 : 7) * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
  const recentIsoEnd = new Date(now.getTime() - (includeOptional ? 2 : 1) * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
  
  for (const [paramName, paramDef] of Object.entries(params)) {
    // Skip optional parameters unless specifically requested
    if (!paramDef.required && !includeOptional) {
      continue;
    }
    
    // Generate sample values based on parameter name and type
    switch (paramDef.type) {
      case "number":
        // Use actual IDs where possible
        if (paramName === "cust_id" || paramName === "customer_id") {
          sampleParams[paramName] = custId;
        } else if (paramName === "car_id") {
          // Use multiple common car IDs for richer data
          sampleParams[paramName] = includeOptional ? 23 : 1; // Skip Barber or Mazda
        } else if (paramName === "track_id") {
          sampleParams[paramName] = includeOptional ? 14 : 1; // Different tracks
        } else if (paramName === "series_id") {
          sampleParams[paramName] = includeOptional ? 39 : 306; // Different series
        } else if (paramName === "league_id") {
          sampleParams[paramName] = 7058; // Known active league
        } else if (paramName === "team_id") {
          sampleParams[paramName] = 1; // Will need a real team ID
        } else if (paramName === "subsession_id") {
          sampleParams[paramName] = 1;
        } else if (paramName === "simsession_number") {
          sampleParams[paramName] = 0;
        } else if (paramName === "event_type") {
          sampleParams[paramName] = includeOptional ? 4 : 5;
        } else if (paramName === "season_year") {
          sampleParams[paramName] = new Date().getFullYear();
        } else if (paramName === "season_quarter") {
          sampleParams[paramName] = Math.ceil((new Date().getMonth() + 1) / 3);
        } else if (paramName === "category_id") {
          // Use different categories: 1=Oval, 2=Road, etc.
          sampleParams[paramName] = includeOptional ? 2 : 1;
        } else if (paramName === "chart_type") {
          // Chart types: 1=iRating, 2=TT Rating, 3=License/SR
          sampleParams[paramName] = includeOptional ? 2 : 1;
        } else if (paramName.includes("_id")) {
          sampleParams[paramName] = includeOptional ? 2 : 1;
        } else {
          sampleParams[paramName] = includeOptional ? 2 : 1;
        }
        break;
        
      case "string":
        if (paramName === "start_range_begin" || paramName === "finish_range_begin") {
          sampleParams[paramName] = recentIso;
        } else if (paramName === "start_range_end" || paramName === "finish_range_end") {
          sampleParams[paramName] = recentIsoEnd;
        } else if (paramName === "search_term") {
          sampleParams[paramName] = includeOptional ? "smith" : "johnson";
        } else if (paramName === "sort") {
          sampleParams[paramName] = "relevance";
        } else if (paramName === "order") {
          sampleParams[paramName] = includeOptional ? "asc" : "desc";
        } else if (paramName.includes("date") || paramName === "from") {
          sampleParams[paramName] = recentIso;
        } else {
          sampleParams[paramName] = includeOptional ? "variant" : "sample";
        }
        break;
        
      case "boolean":
        // Try both true and false for richer data
        sampleParams[paramName] = includeOptional ? false : true;
        break;
        
      case "numbers":
        if (paramName === "cust_ids") {
          // Use multiple customer IDs for richer member data
          sampleParams[paramName] = includeOptional ? [custId, 123456] : [custId];
        } else {
          sampleParams[paramName] = includeOptional ? [1, 2] : [1];
        }
        break;
    }
  }
  
  return sampleParams;
}

/** ---- Generate multiple parameter variations for richer data ---- */
function generateParameterVariations(endpoint: FlatEndpoint, custId: number, context: ScrapeContext): Record<string, any>[] {
  const params = endpoint.params;
  const variations: Record<string, any>[] = [];
  
  // Base case with only required params
  variations.push(generateSampleParams(params, custId, false));
  
  // Enhanced case with optional params  
  const hasOptional = Object.values(params).some(p => !p.required);
  if (hasOptional) {
    variations.push(generateSampleParams(params, custId, true));
  }
  
  // Special variations for specific parameter types
  if (params.car_id && !params.car_id.required) {
    // Try different car types for richer car data
    variations.push({ ...generateSampleParams(params, custId, false), car_id: 3 }); // Solstice
    variations.push({ ...generateSampleParams(params, custId, false), car_id: 23 }); // Skip Barber
  }
  
  if (params.category_id) {
    // Try different racing categories
    for (let catId = 1; catId <= 4; catId++) {
      variations.push({ ...generateSampleParams(params, custId, false), category_id: catId });
    }
  }

  // Endpoint-specific high-confidence parameter sets for hard endpoints
  const seasonId = choosePreferredId(context.seasonIds, "season");
  const subsessionId = choosePreferredId(context.subsessionIds, "subsession");
  const subsessionCandidates = [...new Set(context.subsessionIds.filter((id) => id > 100000))].slice(-4).reverse();
  const simsessionCandidates = [...new Set(context.simsessionNumbers.filter((id) => typeof id === "number" && id <= 0))].slice(0, 3);
  if (!simsessionCandidates.includes(0)) simsessionCandidates.unshift(0);
  const custCandidates = [...new Set([custId, ...context.custIds.filter((id) => id > 0)])].slice(0, 8);
  const teamId = choosePreferredId(context.teamIds, "team");
  const carClassId = choosePreferredId(context.carClassIds, "carClass");
  const seasonCarClassPair = choosePreferredSeasonCarClassPair(context);
  const teamSeasonCarClassPair = choosePreferredTeamSeasonCarClassPair(context);
  const teamSeasonCarClassCandidates = topTeamSeasonCarClassPairs(context, 6);
  const raceWeekNum = context.raceWeekNums[0] ?? 0;
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
  const currentYear = new Date().getFullYear();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");

  switch (endpoint.fullName) {
    case "results.get":
      for (const candidateSubsessionId of subsessionCandidates) {
        variations.push({ subsession_id: candidateSubsessionId, include_licenses: false });
      }
      if (subsessionId !== undefined) variations.push({ subsession_id: subsessionId, include_licenses: false });
      break;
    case "results.event_log":
      for (const candidateSubsessionId of subsessionCandidates) {
        for (const simsessionNumber of simsessionCandidates) {
          variations.push({ subsession_id: candidateSubsessionId, simsession_number: simsessionNumber });
        }
      }
      if (subsessionId !== undefined) variations.push({ subsession_id: subsessionId, simsession_number: 0 });
      break;
    case "results.lap_chart_data":
      for (const candidateSubsessionId of subsessionCandidates) {
        for (const simsessionNumber of simsessionCandidates) {
          variations.push({ subsession_id: candidateSubsessionId, simsession_number: simsessionNumber });
        }
      }
      if (subsessionId !== undefined) variations.push({ subsession_id: subsessionId, simsession_number: 0 });
      break;
    case "results.lap_data":
      {
        const lapCandidates = [...context.lapDataCandidates]
          .filter((candidate) => candidate.subsessionId > 100000)
          .slice(-12)
          .reverse();

        for (const candidate of lapCandidates) {
          if (candidate.custId !== undefined) {
            variations.push({
              subsession_id: candidate.subsessionId,
              simsession_number: candidate.simsessionNumber,
              cust_id: candidate.custId,
            });
          }
          if (candidate.teamId !== undefined) {
            variations.push({
              subsession_id: candidate.subsessionId,
              simsession_number: candidate.simsessionNumber,
              team_id: candidate.teamId,
            });
          }
          if (candidate.custId === undefined && candidate.teamId === undefined) {
            variations.push({
              subsession_id: candidate.subsessionId,
              simsession_number: candidate.simsessionNumber,
              cust_id: custId,
            });
          }
        }

        for (const candidateSubsessionId of subsessionCandidates) {
          for (const simsessionNumber of simsessionCandidates) {
            for (const candidateCustId of custCandidates) {
              variations.push({ subsession_id: candidateSubsessionId, simsession_number: simsessionNumber, cust_id: candidateCustId });
            }
            if (teamId !== undefined) {
              variations.push({ subsession_id: candidateSubsessionId, simsession_number: simsessionNumber, team_id: teamId });
            }
          }
        }
      }
      if (subsessionId !== undefined) {
        variations.push({ subsession_id: subsessionId, simsession_number: 0, cust_id: custId });
      }
      break;
    case "results.search_hosted":
      variations.push({ start_range_begin: sevenDaysAgo, cust_id: custId });
      if (teamId !== undefined) {
        variations.push({ start_range_begin: sevenDaysAgo, team_id: teamId });
      }
      break;
    case "results.search_series":
      variations.push({ season_year: currentYear, season_quarter: currentQuarter, cust_id: custId });
      variations.push({ start_range_begin: sevenDaysAgo, cust_id: custId, official_only: true });
      break;
    case "series.season_schedule":
      if (seasonId !== undefined) variations.push({ season_id: seasonId });
      break;
    case "stats.member_division":
      if (seasonId !== undefined) {
        variations.push({ season_id: seasonId, event_type: 5 });
        variations.push({ season_id: seasonId, event_type: 4 });
      }
      break;
    case "stats.season_driver_standings":
    case "stats.season_supersession_standings":
    case "stats.season_team_standings":
      for (const candidate of teamSeasonCarClassCandidates) {
        variations.push({ season_id: candidate.seasonId, car_class_id: candidate.carClassId, race_week_num: raceWeekNum });
        variations.push({ season_id: candidate.seasonId, car_class_id: candidate.carClassId });
      }
      if (teamSeasonCarClassPair) {
        variations.push({ season_id: teamSeasonCarClassPair.seasonId, car_class_id: teamSeasonCarClassPair.carClassId, race_week_num: raceWeekNum });
      }
      if (seasonCarClassPair) {
        variations.push({ season_id: seasonCarClassPair.seasonId, car_class_id: seasonCarClassPair.carClassId, race_week_num: raceWeekNum });
      } else if (seasonId !== undefined && carClassId !== undefined) {
        variations.push({ season_id: seasonId, car_class_id: carClassId, race_week_num: raceWeekNum });
      }
      break;
    case "stats.season_tt_standings":
      if (seasonCarClassPair) {
        variations.push({ season_id: seasonCarClassPair.seasonId, car_class_id: seasonCarClassPair.carClassId, race_week_num: raceWeekNum });
      } else if (seasonId !== undefined && carClassId !== undefined) {
        variations.push({ season_id: seasonId, car_class_id: carClassId, race_week_num: raceWeekNum });
      }
      break;
    case "stats.season_tt_results":
    case "stats.season_qualify_results":
      if (seasonCarClassPair) {
        variations.push({ season_id: seasonCarClassPair.seasonId, car_class_id: seasonCarClassPair.carClassId, race_week_num: raceWeekNum });
      } else if (seasonId !== undefined && carClassId !== undefined) {
        variations.push({ season_id: seasonId, car_class_id: carClassId, race_week_num: raceWeekNum });
      }
      break;
    case "team.get":
      if (teamId !== undefined) variations.push({ team_id: teamId, include_licenses: false });
      break;
  }

  let normalized = variations
    .map((variation) => applyContextToParams(endpoint, variation, context, custId))
    .filter((v, i, arr) => 
    // Remove duplicates by JSON string comparison
    arr.findIndex(other => JSON.stringify(other) === JSON.stringify(v)) === i
  );

  if (endpoint.fullName === "results.search_hosted") {
    normalized = normalized.filter((v) => (v.start_range_begin || v.finish_range_begin) && (v.cust_id || v.team_id || v.host_cust_id || v.session_name));
  }

  if (endpoint.fullName === "results.search_series") {
    normalized = normalized.filter((v) => (v.start_range_begin || v.finish_range_begin) || (v.season_year && v.season_quarter));
  }

  return normalized;
}

/** ---- Main scraper ---- */
async function scrapeApiSamples() {
  const clientId = process.env.IRACING_CLIENT_ID;
  const clientSecret = process.env.IRACING_CLIENT_SECRET;
  const email = process.env.IRACING_USERNAME;
  const password = process.env.IRACING_PASSWORD;

  if (!clientId || !clientSecret || !email || !password) {
    throw new Error("IRACING_CLIENT_ID, IRACING_CLIENT_SECRET, IRACING_USERNAME, and IRACING_PASSWORD must be set");
  }
  
  // Create samples directory
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
  
  // Initialize client and authenticate
  const client = new IRacingScraperClient(clientId, clientSecret, email, password);
  await client.authenticate();
  
  const custId = client.getCustomerId();
  let endpoints = sortEndpointsForDependencies(flattenEndpoints(index));
  const scrapeContext = loadContextFromExistingSamples(SAMPLES_DIR);
  addUnique(scrapeContext.seasonIds, Number(process.env.IRACING_SEASON_ID));
  addUnique(scrapeContext.subsessionIds, Number(process.env.IRACING_SUBSESSION_ID));
  addUnique(scrapeContext.teamIds, Number(process.env.IRACING_TEAM_ID));
  addUnique(scrapeContext.carClassIds, Number(process.env.IRACING_CAR_CLASS_ID));

  await bootstrapContext(client, scrapeContext);

  // Explicit overrides should win over bootstrapped IDs for targeted sample refreshes.
  preferUnique(scrapeContext.seasonIds, Number(process.env.IRACING_SEASON_ID));
  preferUnique(scrapeContext.subsessionIds, Number(process.env.IRACING_SUBSESSION_ID));
  preferUnique(scrapeContext.teamIds, Number(process.env.IRACING_TEAM_ID));
  preferUnique(scrapeContext.carClassIds, Number(process.env.IRACING_CAR_CLASS_ID));

  if (MISSING_ONLY) {
    const before = endpoints.length;
    endpoints = endpoints.filter((endpoint) => !hasAnySampleForEndpoint(SAMPLES_DIR, endpoint.fullName));
    console.log(`\n🎯 Missing-only mode: ${endpoints.length}/${before} endpoints need samples`);
  }

  if (ONLY_ENDPOINTS) {
    const before = endpoints.length;
    endpoints = endpoints.filter((endpoint) => ONLY_ENDPOINTS.has(endpoint.fullName));
    console.log(`\n🎯 Endpoint filter mode: ${endpoints.length}/${before} endpoints selected`);
  }
  
  console.log(`\n📊 Found ${endpoints.length} endpoints to scrape\n`);
  
  const results = {
    success: [] as string[],
    failed: [] as { endpoint: string; error: string }[],
    skipped: [] as string[],
  };
  
  // Process endpoints with rate limiting
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    const baseSampleFile = path.join(SAMPLES_DIR, `${endpoint.fullName}.json`);
    
    console.log(`🔄 [${i + 1}/${endpoints.length}] Fetching ${endpoint.fullName}...`);
    
    try {
      if (
        ["results.get", "results.event_log", "results.lap_chart_data", "results.lap_data"].includes(endpoint.fullName) &&
        scrapeContext.subsessionIds.length === 0
      ) {
        console.log("   ⚠️  Missing subsession IDs. Set IRACING_SUBSESSION_ID or scrape season.spectator_subsessionids first.");
      }
      if (endpoint.fullName === "team.get" && scrapeContext.teamIds.length === 0) {
        console.log("   ⚠️  Missing team IDs. Set IRACING_TEAM_ID or ensure team.membership returns at least one team.");
      }
      if (
        [
          "series.season_schedule",
          "stats.member_division",
          "stats.season_driver_standings",
          "stats.season_supersession_standings",
          "stats.season_team_standings",
          "stats.season_tt_standings",
          "stats.season_tt_results",
          "stats.season_qualify_results",
        ].includes(endpoint.fullName) &&
        scrapeContext.seasonIds.length === 0
      ) {
        console.log("   ⚠️  Missing season IDs. Set IRACING_SEASON_ID or ensure season/series samples are present.");
      }
      if (
        [
          "stats.season_driver_standings",
          "stats.season_supersession_standings",
          "stats.season_team_standings",
          "stats.season_tt_standings",
          "stats.season_tt_results",
          "stats.season_qualify_results",
        ].includes(endpoint.fullName) &&
        scrapeContext.carClassIds.length === 0
      ) {
        console.log("   ⚠️  Missing car class IDs. Set IRACING_CAR_CLASS_ID or ensure series.seasons samples include car_class_ids.");
      }

      // Generate multiple parameter variations for richer data
      const paramVariations = generateParameterVariations(endpoint, custId, scrapeContext);
      let savedAtLeastOne = false;
      
      for (let varIndex = 0; varIndex < paramVariations.length; varIndex++) {
        const params = paramVariations[varIndex];
        const sampleFile = varIndex === 0 ? baseSampleFile : 
          path.join(SAMPLES_DIR, `${endpoint.fullName}_var${varIndex + 1}.json`);
        
        // Skip if sample already exists (unless force refresh)
        if (fs.existsSync(sampleFile) && !FORCE_REFRESH) {
          console.log(`   ⏭️  Skipping variant ${varIndex + 1} (already exists)`);
          continue;
        }
        
        // Some endpoints need special handling
        if (endpoint.fullName.includes("league") && endpoint.fullName !== "league.get_points_systems") {
          // Most league endpoints need a valid league_id
          const knownLeagueId = 7058; // Example league ID
          if (params.league_id !== undefined) {
            params.league_id = knownLeagueId;
          }
          
          // Skip if still no league_id required param
          if (endpoint.params.league_id?.required && !params.league_id) {
            console.log(`   ⚠️  Skipping variant ${varIndex + 1} - requires league_id`);
            continue;
          }
        }
        
        // Time attack might need specific season IDs
        if (endpoint.fullName.includes("time_attack") && endpoint.params.ta_comp_season_id?.required) {
          // Use a known time attack season ID
          params.ta_comp_season_id = 62; // Example TA season
        }
        
        try {
          // Fetch the endpoint
          const response = await fetchWithRetry(client, endpoint.url, params);
          
          // Save the response
          fs.writeFileSync(sampleFile, JSON.stringify(response, null, 2), "utf8");
          collectContextFromValue(response, scrapeContext);
          console.log(`   ✅ Saved variant ${varIndex + 1} to ${path.basename(sampleFile)}`);
          savedAtLeastOne = true;
          
          // Rate limiting between variants - be nice to the API
          await new Promise(resolve => setTimeout(resolve, 300));
          
        } catch (varError: any) {
          console.error(`   ⚠️  Variant ${varIndex + 1} failed: ${varError.message}`);
          // Continue with other variations
        }
      }
      
      if (savedAtLeastOne) {
        results.success.push(endpoint.fullName);
      } else {
        console.log(`   ❌ No variants succeeded for ${endpoint.fullName}`);
        results.skipped.push(endpoint.fullName);
      }
      
      // Rate limiting between endpoints
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

// Run the scraper with dual logging (console + file)
async function main(): Promise<void> {
  const logger = setupDualLogging(SAMPLES_DIR, CLI_ARGS);

  try {
    await scrapeApiSamples();
    console.log(`🧠 Full scrape logs available at ${logger.logFilePath}`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exitCode = 1;
  } finally {
    await logger.close();
  }
}

main();
