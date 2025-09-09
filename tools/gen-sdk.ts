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
    
    // Use quicktype properly
    const jsonInput = new InputData();
    const jsonString = JSON.stringify(sampleData);
    
    // Add the JSON source properly
    await jsonInput.addSource("json", {
      name: typeName,
      samples: [jsonString],
    }, () => undefined as any);

    const result = await quicktype({
      inputData: jsonInput,
      lang: "typescript",
      rendererOptions: {
        "just-types": true,
        "nice-property-names": true,
        "prefer-unions": true,
        "explicit-unions": true,
      },
    });

    // Process the generated code
    let typeCode = result.lines.join("\n");
    
    // Remove converter functions and clean up
    typeCode = typeCode
      .split("\n")
      .filter(line => !line.includes("Convert") && !line.includes("convert"))
      .join("\n");
    
    // Ensure the main interface uses our desired name
    if (!typeCode.includes(`export interface ${typeName}`)) {
      typeCode = typeCode.replace(/export interface \w+/, `export interface ${typeName}`);
    }
    
    return typeCode;
  } catch (error) {
    console.error(`Failed to generate types for ${samplePath}: ${error}`);
    // Fall back to simple generation
    try {
      const sampleData = JSON.parse(fs.readFileSync(samplePath, "utf8"));
      return generateTypeFromJson(sampleData, typeName);
    } catch {
      return null;
    }
  }
}

/** ---- Generate TypeScript interface from JSON object ---- */
function generateTypeFromJson(obj: any, typeName: string, indent: string = ""): string {
  const lines: string[] = [];
  
  if (Array.isArray(obj)) {
    // Handle arrays
    if (obj.length > 0) {
      const firstItem = obj[0];
      if (typeof firstItem === "object" && firstItem !== null) {
        // Array of objects - generate interface for the item
        const itemTypeName = typeName.replace(/Response$/, "") + "Item";
        const itemType = generateTypeFromJson(firstItem, itemTypeName, "");
        return `${itemType}\n\nexport type ${typeName} = ${itemTypeName}[];`;
      } else {
        // Array of primitives
        const itemType = getTypeForValue(firstItem);
        return `export type ${typeName} = ${itemType}[];`;
      }
    }
    return `export type ${typeName} = any[];`;
  }
  
  // Check if it's a dictionary (object with numeric or similar keys)
  const keys = Object.keys(obj);
  if (keys.length > 0 && keys.every(k => /^\d+$/.test(k))) {
    // It's a dictionary with numeric keys
    const firstValue = obj[keys[0]];
    if (typeof firstValue === "object" && firstValue !== null) {
      const itemTypeName = typeName.replace(/Response$/, "") + "Item";
      const itemType = generateTypeFromJson(firstValue, itemTypeName, "");
      return `${itemType}\n\nexport interface ${typeName} {
  [key: string]: ${itemTypeName};
}`;
    }
  }
  
  // Regular object - generate interface
  lines.push(`export interface ${typeName} {`);
  
  for (const [key, value] of Object.entries(obj)) {
    const propName = toCamelCase(key);
    const typeStr = getTypeForValue(value);
    
    if (propName !== key) {
      lines.push(`  ${propName}: ${typeStr}; // maps from: ${key}`);
    } else {
      lines.push(`  ${propName}: ${typeStr};`);
    }
  }
  
  lines.push(`}`);
  return lines.join("\n");
}

/** ---- Get TypeScript type for a value ---- */
function getTypeForValue(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  
  const type = typeof value;
  
  switch (type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const itemType = getTypeForValue(value[0]);
          return `${itemType}[]`;
        }
        return "any[]";
      }
      return "any";
    default:
      return "any";
  }
}

/** ---- Generate section types file ---- */
async function generateSectionTypes(sectionName: string, endpoints: Flat[]): Promise<string> {
  const lines: string[] = [];
  
  lines.push(`import * as z from "zod/mini";`);
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
        zodType = `z.optional(${zodType})`;
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
  return `import * as z from "zod/mini";

/** Lightweight client with presigned-link following and caching */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const IRacingClientOptionsSchema = z.object({
  email: z.optional(z.string()),
  password: z.optional(z.string()),
  headers: z.optional(z.record(z.string(), z.string())),
  fetchFn: z.optional(z.any()),
  validateParams: z.optional(z.boolean()),
});

export type IRacingClientOptions = z.infer<typeof IRacingClientOptionsSchema>;

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

type CacheEntry = { data: unknown; expiresAt: number };

export class IRacingError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly statusText?: string,
    public readonly responseData?: any
  ) {
    super(message);
    this.name = 'IRacingError';
  }

  get isMaintenanceMode(): boolean {
    return this.status === 503 && 
           this.responseData?.error === 'Site Maintenance';
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export class IRacingClient {
  private baseUrl = 'https://members-ng.iracing.com';
  private fetchFn: FetchLike;
  private authData: AuthResponse | null = null;
  private cookies: Record<string, string> | null = null;
  private email?: string;
  private password?: string;
  private presetHeaders?: Record<string, string>;
  private validateParams: boolean;
  private expiringCache = new Map<string, CacheEntry>();

  constructor(opts: IRacingClientOptions = {}) {
    const validatedOpts = IRacingClientOptionsSchema.parse(opts);
    
    this.fetchFn = validatedOpts.fetchFn ?? (globalThis as any).fetch;
    if (!this.fetchFn) throw new Error("No fetch available. Pass fetchFn in IRacingClientOptions.");
    
    this.email = validatedOpts.email;
    this.password = validatedOpts.password;
    this.presetHeaders = validatedOpts.headers as Record<string, string> | undefined;
    this.validateParams = validatedOpts.validateParams ?? true;
    
    if (!this.email && !this.password && !this.presetHeaders) {
      throw new Error("Must provide either email/password or headers for authentication");
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint.startsWith("http") ? endpoint : \`\${this.baseUrl}\${endpoint}\`);
    
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

  private async ensureAuthenticated(): Promise<void> {
    if (this.presetHeaders) {
      // Using preset headers, no authentication needed
      return;
    }
    
    if (!this.authData && this.email && this.password) {
      await this.authenticate();
    }
  }

  private async authenticate(): Promise<void> {
    if (!this.email || !this.password) {
      throw new Error("Email and password required for authentication");
    }

    const response = await this.fetchFn(\`\${this.baseUrl}/auth\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: this.email, 
        password: this.password 
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(\`Authentication failed: \${response.statusText} - \${text}\`);
    }

    this.authData = await response.json();
    
    // Parse and store cookies
    if (!this.authData) {
      throw new Error('Authentication failed - no auth data received');
    }
    
    this.cookies = {
      'irsso_membersv2': this.authData.ssoCookieValue,
      'authtoken_members': \`%7B%22authtoken%22%3A%7B%22authcode%22%3A%22\${this.authData.authcode}%22%2C%22email%22%3A%22\${encodeURIComponent(this.authData.email)}%22%7D%7D\`
    };
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


  async get<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    await this.ensureAuthenticated();

    // Convert camelCase params back to snake_case for the API
    const apiParams = this.mapParamsToApi(params);
    
    const headers: Record<string, string> = {};
    
    if (this.presetHeaders) {
      // Use preset headers (like cookies from manual auth)
      Object.assign(headers, this.presetHeaders);
    } else if (this.cookies) {
      // Use authenticated cookies
      const cookieString = Object.entries(this.cookies)
        .map(([name, value]) => \`\${name}=\${value}\`)
        .join('; ');
      headers['Cookie'] = cookieString;
    } else {
      throw new Error('No authentication available');
    }

    const response = await this.fetchFn(this.buildUrl(url, apiParams), {
      headers,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      let responseData: any = null;
      
      // Try to parse JSON error response
      try {
        responseData = JSON.parse(text);
      } catch {
        // Not JSON, use raw text
      }
      
      // Handle maintenance mode specifically
      if (response.status === 503 && responseData?.error === 'Site Maintenance') {
        throw new IRacingError(
          \`iRacing is currently in maintenance mode: \${responseData.message || 'Service temporarily unavailable'}\`,
          response.status,
          response.statusText,
          responseData
        );
      }
      
      // Handle other specific errors
      if (response.status === 429) {
        throw new IRacingError(
          'Rate limit exceeded. Please wait before making more requests.',
          response.status,
          response.statusText,
          responseData
        );
      }
      
      if (response.status === 401) {
        throw new IRacingError(
          'Authentication failed. Please check your credentials.',
          response.status,
          response.statusText,
          responseData
        );
      }
      
      // Generic error
      const errorMessage = responseData?.message || responseData?.error || text || response.statusText;
      throw new IRacingError(
        \`Request failed: \${errorMessage}\`,
        response.status,
        response.statusText,
        responseData
      );
    }

    const contentType = response.headers.get("content-type") || "";
    
    // Check if this is a direct JSON response (some endpoints don't use S3)
    if (contentType.includes("application/json")) {
      const data = await response.json();
      
      // Check if it's an S3 link response
      if (data.link && data.expires) {
        // Fetch the actual data from S3
        const s3Response = await this.fetchFn(data.link);
        if (!s3Response.ok) {
          throw new Error(\`Failed to fetch from S3: \${s3Response.statusText}\`);
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
          } as T;
        }
        
        return s3Response.json() as Promise<T>;
      }
      
      return data;
    }

    throw new Error(\`Unexpected content type: \${contentType}\`);
  }

  isAuthenticated(): boolean {
    return this.authData !== null || !!this.presetHeaders;
  }

  getCustomerId(): number | null {
    return this.authData?.custId ?? null;
  }
}
`;
}

/** ---- Generate main SDK class ---- */
function generateMainSDK(sections: string[]): string {
  const lines: string[] = [];
  
  lines.push(`/* AUTO-GENERATED — do not edit */`);
  lines.push(``);
  lines.push(`import { IRacingClient, IRacingError, type IRacingClientOptions } from "./client";`);
  
  // Import all service classes
  for (const section of sections) {
    const className = toPascal(section) + "Service";
    const fileName = toKebab(section);
    lines.push(`import { ${className} } from "./services/${fileName}.service";`);
  }
  
  lines.push(``);
  lines.push(`export { IRacingClient, IRacingError, type IRacingClientOptions };`);
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