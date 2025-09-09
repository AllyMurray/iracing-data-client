#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";

/** ---- Input types (from your index JSON) ---- */
type ParamType = "string" | "number" | "boolean" | "numbers";
type ParamDef = { type: ParamType; required?: boolean; note?: string };
type Endpoint = { link: string; parameters?: Record<string, ParamDef> };
type Section = Record<string, Endpoint | Record<string, Endpoint>>;
type Root = Record<string, Section>;

/** ---- CLI args ---- */
const INPUT = process.argv[2] ?? "api-index.json";
const OUT = process.argv[3] ?? "src/iracing-sdk.gen.ts";
const SAMPLES_DIR = process.argv[4] ?? "samples"; // optional folder with response samples

const index: Root = JSON.parse(fs.readFileSync(INPUT, "utf8"));

/** ---- Flatten endpoints ---- */
type Flat = {
  section: string;
  name: string;         // "league.get"
  method: string;       // "league_get"
  url: string;
  params: Record<string, ParamDef>;
  samplePath?: string;  // samples/league.get.json
};

function isEndpoint(x: any): x is Endpoint {
  return x && typeof x === "object" && typeof x.link === "string";
}

function flatten(root: Root): Flat[] {
  const out: Flat[] = [];
  for (const [sectionName, section] of Object.entries(root)) {
    for (const [key, val] of Object.entries(section)) {
      if (isEndpoint(val)) {
        out.push(mk(sectionName, key, val));
      } else if (val && typeof val === "object") {
        for (const [k2, v2] of Object.entries(val)) {
          if (isEndpoint(v2)) out.push(mk(sectionName, `${key}.${k2}`, v2));
        }
      }
    }
  }
  return out;

  function mk(section: string, name: string, ep: Endpoint): Flat {
    const base = `${section}.${name}`;
    const method = base.replace(/[^\w]/g, "_");
    const candidate = path.join(SAMPLES_DIR, `${base}.json`);
    return {
      section,
      name: base,
      method,
      url: ep.link,
      params: ep.parameters ?? {},
      samplePath: fs.existsSync(candidate) ? candidate : undefined,
    };
  }
}

/** ---- Helpers ---- */
function cap(x: string) {
  return x.replace(/(^|_)([a-z])/g, (_, __, c) => c.toUpperCase());
}
function schemaNameFor(method: string) {
  return cap(method) + "ParamsSchema";
}
function respSchemaNameFor(method: string) {
  return cap(method) + "ResponseSchema";
}
function tsType(t: ParamType): string {
  switch (t) {
    case "string": return "string";
    case "number": return "number";
    case "boolean": return "boolean";
    case "numbers": return "number[]";
    default: return "unknown";
  }
}

const endpoints = flatten(index);

/** ---- Start output ---- */
let out = `/* AUTO-GENERATED — do not edit */

import { z } from "zod-mini";

/** Lightweight client with presigned-link following and caching */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface IRacingClientOptions {
  headers?: Record<string, string>; // e.g. Cookie for iRacing
  fetchFn?: FetchLike;              // uses global fetch by default
}

type ExpiringLink = { link: string; expires?: string };
type CacheEntry = { data: unknown; expiresAt: number };

export class IRacingClient {
  private fetchFn: FetchLike;
  private headers?: Record<string, string>;
  private expiringCache = new Map<string, CacheEntry>();

  constructor(opts: IRacingClientOptions = {}) {
    this.fetchFn = opts.fetchFn ?? (globalThis as any).fetch;
    if (!this.fetchFn) throw new Error("No fetch available. Pass fetchFn in IRacingClientOptions.");
    this.headers = opts.headers;
  }

  private toQuery(params: Record<string, any>) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params || {})) {
      if (v == null) continue;
      if (Array.isArray(v)) usp.set(k, v.join(","));
      else if (typeof v === "boolean") usp.set(k, v ? "true" : "false");
      else usp.set(k, String(v));
    }
    const s = usp.toString();
    return s ? \`?\${s}\` : "";
  }

  private async get<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    const q = this.toQuery(params || {});
    const res = await this.fetchFn(url + q, { headers: this.headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(\`HTTP \${res.status} \${res.statusText} — \${text}\`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json() as Promise<T>;
    return res.text() as unknown as T;
  }

  private isExpiring(x: any): x is ExpiringLink {
    return !!x && typeof x === "object" && typeof x.link === "string";
  }

  private expiresToMs(expires?: string) {
    if (!expires) return;
    const t = Date.parse(expires);
    return Number.isFinite(t) ? t : undefined;
  }

  /** Follows {link, expires} payloads (presigned S3) and caches until expiry. */
  async getDeep<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    const first = await this.get<unknown>(url, params);
    if (!this.isExpiring(first)) return first as T;

    const { link, expires } = first;
    const now = Date.now();
    const cached = this.expiringCache.get(link);
    if (cached && cached.expiresAt > now + 1000) return cached.data as T;

    const pull = async (l: string, e?: string): Promise<T> => {
      const res = await this.fetchFn(l, { headers: this.headers });
      if (!res.ok) throw new Error(\`Final hop failed \${res.status}\`);
      const ct = res.headers.get("content-type") || "";
      const data = (ct.includes("application/json") ? await res.json() : await res.text()) as T;
      const expMs = this.expiresToMs(e) ?? now + 60_000;
      this.expiringCache.set(l, { data, expiresAt: expMs });
      return data;
    };

    try {
      return await pull(link, expires);
    } catch {
      // refresh first hop if expired
      const refreshed = await this.get<unknown>(url, params);
      if (this.isExpiring(refreshed)) return pull(refreshed.link, refreshed.expires);
      return refreshed as T;
    }
  }

  /** Resolve images from iRacing’s static host. */
  imageUrl(relative: string, base = "https://images-static.iracing.com/") {
    if (!relative) return relative;
    if (/^https?:\\/\\//i.test(relative)) return relative;
    return base.replace(/\\/+$/, "") + "/" + relative.replace(/^\\/+/, "");
  }
}

// ---- Parameter schemas (zod-mini) ----
`;

/** ---- Param schemas/types ---- */
for (const ep of endpoints) {
  const shape = Object.entries(ep.params).map(([k, def]) => {
    const map = (() => {
      switch (def.type) {
        case "string":  return "z.string()";
        case "number":  return "z.number()";
        case "boolean": return "z.boolean()";
        case "numbers": return "z.array(z.number())";
        default:        return "z.any()";
      }
    })();
    return `  ${JSON.stringify(k)}: ${map}${def.required ? "" : ".optional()"}`;
  }).join(",\n");

  const sName = schemaNameFor(ep.method);
  const tName = `${cap(ep.method)}Params`;
  out += `export const ${sName} = z.object({${shape ? "\n" + shape + "\n" : ""}});\n`;
  out += `export type ${tName} = z.infer<typeof ${sName}>;\n\n`;
}

/** ---- Response schema inferrer (simple, zod-mini-safe) ----
 * - Only uses z.string/number/boolean/array/object/any
 * - null → z.any() (to avoid unions)
 * - arrays: unify element schemas; if heterogeneous → z.array(z.any())
 */
function inferZodFromSample(value: any): string {
  const t = typeof value;
  if (value === null || value === undefined) return "z.any()";
  if (t === "string")  return "z.string()";
  if (t === "number")  return "z.number()";
  if (t === "boolean") return "z.boolean()";
  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.any())";
    // Try to infer a single element schema; if mixed, fall back to any
    const first = inferZodFromSample(value[0]);
    for (let i = 1; i < value.length; i++) {
      const cur = inferZodFromSample(value[i]);
      if (cur !== first) return "z.array(z.any())";
    }
    return `z.array(${first})`;
  }
  if (t === "object") {
    const entries = Object.entries(value).map(([k, v]) => {
      const child = inferZodFromSample(v);
      return `  ${JSON.stringify(k)}: ${child}`;
    });
    return `z.object({\n${entries.join(",\n")}\n})`;
  }
  return "z.any()";
}

/** ---- Response schemas/types ---- */
for (const ep of endpoints) {
  const rsName = respSchemaNameFor(ep.method);
  const rtName = `${cap(ep.method)}Response`;
  if (ep.samplePath) {
    const sample = JSON.parse(fs.readFileSync(ep.samplePath, "utf8"));
    const schemaCode = inferZodFromSample(sample);
    out += `export const ${rsName} = ${schemaCode};\n`;
  } else {
    out += `export const ${rsName} = z.unknown();\n`;
  }
  out += `export type ${rtName} = z.infer<typeof ${rsName}>;\n\n`;
}

/** ---- Endpoint functions (validated params + validated responses) ---- */
out += `// ---- Endpoint functions ----\n`;
for (const ep of endpoints) {
  const hasParams = Object.keys(ep.params).length > 0;
  const pT = `${cap(ep.method)}Params`;
  const rT = `${cap(ep.method)}Response`;
  const pSchema = schemaNameFor(ep.method);
  const rSchema = respSchemaNameFor(ep.method);

  out += `
export async function ${ep.method}(client: IRacingClient${hasParams ? `, params: ${pT}` : ""}): Promise<${rT}> {
  ${hasParams ? `const parsed = ${pSchema}.parse(params);` : ""}
  const data = await client.getDeep<unknown>("${ep.url}"${hasParams ? ", parsed" : ""});
  return ${rSchema}.parse(data);
}
`;
}

/** ---- Write file ---- */
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, "utf8");
console.log(`Generated ${OUT} with ${endpoints.length} endpoints.`);
