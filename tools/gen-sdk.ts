#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";
import { quicktype, InputData, JSONSchemaInput, TypeScriptTargetLanguage } from "quicktype-core";

/** ---- Input types (from your index JSON) ---- */
type ParamType = "string" | "number" | "boolean" | "numbers";
type ParamDef = { type: ParamType; required?: boolean; note?: string };
type Endpoint = { link: string; parameters?: Record<string, ParamDef> };
type Section = Record<string, Endpoint | Record<string, Endpoint>>;
type Root = Record<string, Section>;

/** ---- CLI args ---- */
const INPUT = process.argv[2] ?? "docs/api/index.json";
const OUT_DIR = process.argv[3] ?? "src/sdk";
const SAMPLES_DIR = process.argv[4] ?? "samples";

const index: Root = JSON.parse(fs.readFileSync(INPUT, "utf8"));

/** ---- Flatten endpoints ---- */
type Flat = {
  section: string;
  name: string;         // "league.get"
  method: string;       // "league_get"
  url: string;
  params: Record<string, ParamDef>;
  samplePath?: string;
  responseType?: string; // Generated response type name
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
    const method = toCamelCase(base.replace(/[^\w]/g, "_"));
    const sampleFile = `${SAMPLES_DIR}/${base}.json`;
    return {
      section,
      name,
      method,
      url: ep.link,
      params: ep.parameters || {},
      samplePath: fs.existsSync(sampleFile) ? sampleFile : undefined,
      responseType: fs.existsSync(sampleFile) ? `${toPascal(base.replace(/[^\w]/g, "_"))}Response` : undefined,
    };
  }
}

/** ---- Helper functions ---- */
function toPascal(s: string): string {
  return s.split(/[_\-\.]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function toCamelCase(s: string): string {
  const parts = s.split(/[_\-\.]/);
  return parts[0].toLowerCase() + parts.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function toKebab(s: string): string {
  return s.replace(/[_\.]/g, "-").toLowerCase();
}

/** ---- Generate TypeScript types from JSON sample using quicktype ---- */
async function generateTypesFromSample(samplePath: string, typeName: string): Promise<string | null> {
  try {
    const sampleData = JSON.parse(fs.readFileSync(samplePath, "utf8"));
    
    // Check if this is a CSV response wrapper
    if (sampleData._contentType === "csv") {
      // For CSV responses, just return a simple type
      return `export interface ${typeName} {
  _contentType: "csv";
  _rawData: string;
  _note: string;
}`;
    }
    
    const jsonInput = new InputData();
    const jsonString = JSON.stringify(sampleData);
    
    // Use the newer API
    const source = { name: typeName, samples: [jsonString] };
    await jsonInput.addSource("json", source, () => undefined);

    const result = await quicktype({
      inputData: jsonInput,
      lang: "typescript",
      rendererOptions: {
        "just-types": "true",
        "nice-property-names": "true",
        "prefer-unions": "true",
      },
    });

    let typeCode = result.lines.join("\n");
    
    // Clean up the generated code - ensure we use the right type name
    const lines = typeCode.split("\n");
    const processedLines: string[] = [];
    let foundMainType = false;
    
    for (const line of lines) {
      if (line.startsWith("export interface") && !foundMainType) {
        // Replace the first interface with our desired name
        processedLines.push(`export interface ${typeName} {`);
        foundMainType = true;
      } else if (line.trim() && !line.includes("Convert")) {
        // Skip any converter function definitions
        processedLines.push(line);
      }
    }
    
    return processedLines.join("\n");
  } catch (error) {
    console.error(`Failed to generate types for ${samplePath}: ${error}`);
    return null;
  }
}

/** ---- Generate section types file ---- */
async function generateSectionTypes(sectionName: string, endpoints: Flat[]): Promise<string> {
  const lines: string[] = [];
  
  lines.push(`import { z } from "zod-mini";`);
  lines.push(``);
  lines.push(`// ---- Response Types ----`);
  lines.push(``);
  
  // Generate response types from samples
  const responseTypes: string[] = [];
  for (const ep of endpoints) {
    if (ep.samplePath && ep.responseType) {
      const types = await generateTypesFromSample(ep.samplePath, ep.responseType);
      if (types) {
        responseTypes.push(types);
      }
    }
  }
  
  if (responseTypes.length > 0) {
    lines.push(responseTypes.join("\n\n"));
    lines.push(``);
  }
  
  lines.push(`// ---- Parameter Schemas ----`);
  lines.push(``);
  
  // Generate parameter schemas
  for (const ep of endpoints) {
    const schemaName = `${toPascal(ep.method)}ParamsSchema`;
    lines.push(`const ${schemaName} = z.object({`);
    
    for (const [paramName, paramDef] of Object.entries(ep.params)) {
      let zodType = "z.unknown()";
      
      switch (paramDef.type) {
        case "string":
          zodType = "z.string()";
          break;
        case "number":
          zodType = "z.number()";
          break;
        case "boolean":
          zodType = "z.boolean()";
          break;
        case "numbers":
          zodType = "z.array(z.number())";
          break;
      }
      
      if (!paramDef.required) {
        zodType += ".optional()";
      }
      
      // Convert param name to camelCase for the schema
      const camelParamName = toCamelCase(paramName);
      const comment = paramDef.note ? ` // ${paramDef.note}` : "";
      
      // If the param name differs from original, we need to map it
      if (camelParamName !== paramName) {
        lines.push(`  ${camelParamName}: ${zodType},${comment} // maps to: ${paramName}`);
      } else {
        lines.push(`  ${paramName}: ${zodType},${comment}`);
      }
    }
    
    lines.push(`});`);
    lines.push(``);
  }
  
  lines.push(`// ---- Exported Parameter Types ----`);
  lines.push(``);
  
  // Export parameter types
  for (const ep of endpoints) {
    const typeName = `${toPascal(ep.method)}Params`;
    const schemaName = `${toPascal(ep.method)}ParamsSchema`;
    lines.push(`export type ${typeName} = z.infer<typeof ${schemaName}>;`);
  }
  
  lines.push(``);
  lines.push(`// ---- Exported Schemas ----`);
  lines.push(``);
  lines.push(`export {`);
  for (const ep of endpoints) {
    const schemaName = `${toPascal(ep.method)}ParamsSchema`;
    lines.push(`  ${schemaName},`);
  }
  lines.push(`};`);
  
  return lines.join("\n");
}

/** ---- Generate service class for a section ---- */
function generateSectionService(sectionName: string, endpoints: Flat[]): string {
  const lines: string[] = [];
  const className = toPascal(sectionName) + "Service";
  const typesFile = `./${toKebab(sectionName)}.types`;
  
  lines.push(`import type { IRacingClient } from "../client";`);
  
  // Import types
  const paramImports = endpoints.map(ep => `${toPascal(ep.method)}Params`);
  const responseImports = endpoints
    .filter(ep => ep.responseType)
    .map(ep => ep.responseType!);
  
  const allImports = [...paramImports, ...responseImports].join(", ");
  lines.push(`import type { ${allImports} } from "${typesFile}";`);
  lines.push(``);
  
  // Generate service class
  lines.push(`export class ${className} {`);
  lines.push(`  constructor(private client: IRacingClient) {}`);
  lines.push(``);
  
  for (const ep of endpoints) {
    // Use camelCase for the method name
    const methodName = toCamelCase(ep.name.replace(/\./g, "_"));
    const paramsType = `${toPascal(ep.method)}Params`;
    const returnType = ep.responseType || "unknown";
    const hasParams = Object.keys(ep.params).length > 0;
    
    lines.push(`  /**`);
    lines.push(`   * ${ep.name}`);
    lines.push(`   * @see ${ep.url}`);
    if (ep.samplePath) {
      lines.push(`   * @sample ${ep.samplePath.replace(SAMPLES_DIR + "/", "")}`);
    }
    lines.push(`   */`);
    
    if (hasParams) {
      lines.push(`  async ${methodName}(params: ${paramsType}): Promise<${returnType}> {`);
      lines.push(`    return this.client.get<${returnType}>("${ep.url}", params);`);
    } else {
      lines.push(`  async ${methodName}(): Promise<${returnType}> {`);
      lines.push(`    return this.client.get<${returnType}>("${ep.url}");`);
    }
    
    lines.push(`  }`);
    lines.push(``);
  }
  
  lines.push(`}`);
  
  return lines.join("\n");
}

/** ---- Generate client base class ---- */
function generateClientBase(): string {
  return `import { z } from "zod-mini";

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
    return s ? "?" + s : "";
  }

  async get<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    // Convert camelCase params back to snake_case for the API
    const apiParams = this.mapParamsToApi(params);
    const q = this.toQuery(apiParams || {});
    const res = await this.fetchFn(url + q, { headers: this.headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(\`HTTP \${res.status} \${res.statusText} — \${text}\`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json() as Promise<T>;
    return res.text() as unknown as T;
  }
  
  private mapParamsToApi(params?: Record<string, any>): Record<string, any> | undefined {
    if (!params) return undefined;
    const mapped: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
      mapped[snakeKey] = value;
    }
    return mapped;
  }

  private async getExpiring<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    const apiParams = this.mapParamsToApi(params);
    const cacheKey = url + this.toQuery(apiParams || {});
    const cached = this.expiringCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }

    const linkData = await this.get<ExpiringLink>(url, params);
    if (!linkData?.link) throw new Error("No presigned link received");

    const data = await this.get<T>(linkData.link);
    
    if (linkData.expires) {
      const exp = new Date(linkData.expires).getTime() - 60_000;
      this.expiringCache.set(cacheKey, { data, expiresAt: exp });
    }
    
    return data;
  }
}
`;
}

/** ---- Generate main SDK class ---- */
function generateMainSDK(sections: string[]): string {
  const lines: string[] = [];
  
  lines.push(`/* AUTO-GENERATED — do not edit */`);
  lines.push(``);
  lines.push(`import { IRacingClient, type IRacingClientOptions } from "./client";`);
  
  // Import all service classes
  for (const section of sections) {
    const className = toPascal(section) + "Service";
    const fileName = toKebab(section);
    lines.push(`import { ${className} } from "./services/${fileName}.service";`);
  }
  
  lines.push(``);
  lines.push(`export { IRacingClient, type IRacingClientOptions };`);
  lines.push(``);
  
  // Export all types
  for (const section of sections) {
    const fileName = toKebab(section);
    lines.push(`export * from "./services/${fileName}.types";`);
  }
  
  lines.push(``);
  lines.push(`export class IRacingSDK {`);
  lines.push(`  private client: IRacingClient;`);
  lines.push(``);
  
  // Declare service properties
  for (const section of sections) {
    const propName = toCamelCase(section);
    const className = toPascal(section) + "Service";
    lines.push(`  public ${propName}: ${className};`);
  }
  
  lines.push(``);
  lines.push(`  constructor(opts: IRacingClientOptions = {}) {`);
  lines.push(`    this.client = new IRacingClient(opts);`);
  lines.push(``);
  
  // Initialize services
  for (const section of sections) {
    const propName = toCamelCase(section);
    const className = toPascal(section) + "Service";
    lines.push(`    this.${propName} = new ${className}(this.client);`);
  }
  
  lines.push(`  }`);
  lines.push(`}`);
  
  return lines.join("\n");
}

/** ---- Main execution ---- */
async function generateSDK() {
  const endpoints = flatten(index);
  const bySection = new Map<string, Flat[]>();

  for (const ep of endpoints) {
    const list = bySection.get(ep.section) || [];
    list.push(ep);
    bySection.set(ep.section, list);
  }

  // Create output directories
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, "services"), { recursive: true });

  // Generate client base
  fs.writeFileSync(path.join(OUT_DIR, "client.ts"), generateClientBase(), "utf8");
  console.log(`Generated ${OUT_DIR}/client.ts`);

  // Generate files for each section
  const sections: string[] = [];
  for (const [section, eps] of bySection) {
    sections.push(section);
    
    // Generate types file
    const typesFile = path.join(OUT_DIR, "services", `${toKebab(section)}.types.ts`);
    const typesContent = await generateSectionTypes(section, eps);
    fs.writeFileSync(typesFile, typesContent, "utf8");
    console.log(`Generated ${typesFile} with ${eps.length} endpoints`);
    
    // Generate service file
    const serviceFile = path.join(OUT_DIR, "services", `${toKebab(section)}.service.ts`);
    fs.writeFileSync(serviceFile, generateSectionService(section, eps), "utf8");
    console.log(`Generated ${serviceFile}`);
  }

  // Generate main SDK file
  fs.writeFileSync(path.join(OUT_DIR, "index.ts"), generateMainSDK(sections), "utf8");
  console.log(`Generated ${OUT_DIR}/index.ts`);

  console.log(`\nSuccessfully generated typed SDK with ${endpoints.length} endpoints across ${sections.length} sections!`);
}

// Run the generator
generateSDK().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});