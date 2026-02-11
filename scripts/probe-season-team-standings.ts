#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";
import { requestPasswordLimitedToken } from "../src/auth/flows/password-limited";

type Pair = { seasonId: number; carClassId: number; source: string };

const DOCS_ENDPOINT = "https://members-ng.iracing.com/data/stats/season_team_standings";
const DEFAULT_SAMPLE_PATH = "samples/stats.season_team_standings.json";

function parseNumberList(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value));
}

function getArg(name: string): string | undefined {
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(`--${name}=`));
  if (inline) {
    return inline.slice(name.length + 3);
  }

  const index = args.indexOf(`--${name}`);
  if (index >= 0 && args[index + 1] && !args[index + 1].startsWith("--")) {
    return args[index + 1];
  }

  return undefined;
}

function hasFlag(name: string): boolean {
  const args = process.argv.slice(2);
  return args.includes(`--${name}`);
}

function addPair(pairs: Pair[], seen: Set<string>, seasonId: unknown, carClassId: unknown, source: string): void {
  if (typeof seasonId !== "number" || typeof carClassId !== "number") return;
  if (!Number.isFinite(seasonId) || !Number.isFinite(carClassId)) return;
  if (seasonId <= 0 || carClassId <= 0) return;

  const key = `${seasonId}|${carClassId}`;
  if (seen.has(key)) return;

  seen.add(key);
  pairs.push({ seasonId, carClassId, source });
}

function collectPairsFromValue(value: unknown, pairs: Pair[], seen: Set<string>, source: string, inheritedSeasonId?: number): void {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) {
    for (const item of value) {
      collectPairsFromValue(item, pairs, seen, source, inheritedSeasonId);
    }
    return;
  }
  if (typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  const seasonId = typeof record.season_id === "number" ? record.season_id : inheritedSeasonId;

  if (seasonId !== undefined) {
    if (typeof record.car_class_id === "number") {
      addPair(pairs, seen, seasonId, record.car_class_id, source);
    }
    if (Array.isArray(record.car_class_ids)) {
      for (const carClassId of record.car_class_ids) {
        addPair(pairs, seen, seasonId, carClassId, source);
      }
    }
    if (Array.isArray(record.race_week_car_class_ids)) {
      for (const carClassId of record.race_week_car_class_ids) {
        addPair(pairs, seen, seasonId, carClassId, source);
      }
    }
  }

  for (const nested of Object.values(record)) {
    collectPairsFromValue(nested, pairs, seen, source, seasonId);
  }
}

function collectPairsFromSamples(samplesDir: string): Pair[] {
  const pairs: Pair[] = [];
  const seen = new Set<string>();
  if (!fs.existsSync(samplesDir)) return pairs;

  const files = fs.readdirSync(samplesDir).filter((file) => file.endsWith(".json"));
  for (const file of files) {
    const fullPath = path.join(samplesDir, file);
    try {
      const parsed = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      collectPairsFromValue(parsed, pairs, seen, file);
    } catch {
      // Ignore malformed sample files
    }
  }

  return pairs;
}

function rankPairs(pairs: Pair[]): Pair[] {
  const counts = new Map<string, { seasonId: number; carClassId: number; count: number; source: string }>();

  for (const pair of pairs) {
    const key = `${pair.seasonId}|${pair.carClassId}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { seasonId: pair.seasonId, carClassId: pair.carClassId, count: 1, source: pair.source });
    }
  }

  return [...counts.values()]
    .sort((a, b) => (b.count - a.count) || (b.seasonId - a.seasonId))
    .map((item) => ({ seasonId: item.seasonId, carClassId: item.carClassId, source: `${item.source} (x${item.count})` }));
}

function summarizePayload(payload: unknown): string {
  if (payload === null || payload === undefined) return "empty payload";
  if (Array.isArray(payload)) return `array(${payload.length})`;
  if (typeof payload === "object") {
    const keys = Object.keys(payload as Record<string, unknown>).slice(0, 12);
    return `object keys: ${keys.join(", ")}`;
  }
  return `primitive: ${String(payload)}`;
}

async function fetchEndpoint(
  accessToken: string,
  seasonId: number,
  carClassId: number,
  raceWeekNum?: number
): Promise<{ ok: boolean; status: number; body: string; payload?: unknown }> {
  const url = new URL(DOCS_ENDPOINT);
  url.searchParams.set("season_id", String(seasonId));
  url.searchParams.set("car_class_id", String(carClassId));
  if (raceWeekNum !== undefined) {
    url.searchParams.set("race_week_num", String(raceWeekNum));
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const rawText = await response.text();
  if (!response.ok) {
    return { ok: false, status: response.status, body: rawText };
  }

  let json: any = null;
  try {
    json = rawText ? JSON.parse(rawText) : null;
  } catch {
    return { ok: true, status: response.status, body: rawText };
  }

  if (json && typeof json === "object" && typeof json.link === "string") {
    const s3Response = await fetch(json.link);
    const s3Text = await s3Response.text();
    if (!s3Response.ok) {
      return {
        ok: false,
        status: s3Response.status,
        body: `S3 fetch failed: ${s3Text}`,
      };
    }

    try {
      const s3Json = JSON.parse(s3Text);
      return { ok: true, status: response.status, body: rawText, payload: s3Json };
    } catch {
      return { ok: true, status: response.status, body: rawText, payload: s3Text };
    }
  }

  return { ok: true, status: response.status, body: rawText, payload: json };
}

async function main(): Promise<void> {
  const clientId = process.env.IRACING_CLIENT_ID;
  const clientSecret = process.env.IRACING_CLIENT_SECRET;
  const username = process.env.IRACING_USERNAME;
  const password = process.env.IRACING_PASSWORD;

  if (!clientId || !clientSecret || !username || !password) {
    throw new Error("IRACING_CLIENT_ID, IRACING_CLIENT_SECRET, IRACING_USERNAME, and IRACING_PASSWORD are required");
  }

  const seasonIds = parseNumberList(getArg("season-ids"));
  const carClassIds = parseNumberList(getArg("car-class-ids"));
  const raceWeekNumsArg = parseNumberList(getArg("race-week-nums"));
  const raceWeekNums = raceWeekNumsArg.length > 0 ? raceWeekNumsArg : [undefined as unknown as number, -1, 0, 1];
  const samplesDir = getArg("samples-dir") || "samples";
  const limit = Number(getArg("limit") || "12");
  const saveSample = hasFlag("save-sample");
  const outputPath = getArg("output") || DEFAULT_SAMPLE_PATH;

  const explicitPairs: Pair[] = [];
  const explicitSeen = new Set<string>();
  if (seasonIds.length > 0 && carClassIds.length > 0) {
    for (const seasonId of seasonIds) {
      for (const carClassId of carClassIds) {
        addPair(explicitPairs, explicitSeen, seasonId, carClassId, "cli");
      }
    }
  }

  const samplePairs = rankPairs(collectPairsFromSamples(samplesDir));
  const probePairs = [...explicitPairs, ...samplePairs].slice(0, Math.max(1, limit));
  if (probePairs.length === 0) {
    throw new Error("No candidate season/car_class pairs found. Pass --season-ids and --car-class-ids.");
  }

  console.log(`Docs endpoint: ${DOCS_ENDPOINT}`);
  console.log(`Trying ${probePairs.length} season/car_class pair(s)`);
  console.log(`Race week candidates: ${raceWeekNums.map((n) => (n === undefined ? "omitted" : String(n))).join(", ")}`);

  const token = await requestPasswordLimitedToken({
    clientId,
    clientSecret,
    username,
    password,
    fetchFn: fetch,
  });

  for (const pair of probePairs) {
    for (const raceWeekNum of raceWeekNums) {
      const descriptor = `season_id=${pair.seasonId}, car_class_id=${pair.carClassId}, race_week_num=${raceWeekNum === undefined ? "<omitted>" : raceWeekNum}`;
      try {
        const result = await fetchEndpoint(token.access_token, pair.seasonId, pair.carClassId, raceWeekNum);
        if (!result.ok) {
          console.log(`FAIL  [${result.status}] ${descriptor}`);
          console.log(`      ${result.body.slice(0, 300).replace(/\s+/g, " ")}`);
          continue;
        }

        console.log(`PASS  [${result.status}] ${descriptor}`);
        if (result.payload !== undefined) {
          console.log(`      ${summarizePayload(result.payload)}`);
        }

        if (saveSample && result.payload !== undefined) {
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, JSON.stringify(result.payload, null, 2), "utf8");
          console.log(`      Saved sample to ${outputPath}`);
        }
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`ERROR ${descriptor}`);
        console.log(`      ${message}`);
      }
    }
  }

  console.log("No successful payload found.");
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(message);
  process.exit(1);
});
