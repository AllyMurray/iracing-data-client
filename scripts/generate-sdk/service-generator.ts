import { toCamelCase, toPascal } from "./utils";
import type { Flat, ParamDef } from "./types";

function hasRequiredParams(params: Record<string, ParamDef>): boolean {
  return Object.values(params).some((param) => param.required === true);
}

function getZodTypeForParam(paramDef: ParamDef): string {
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

  return paramDef.required ? zodType : `z.optional(${zodType})`;
}

function generateParamValidator(name: string, params: Record<string, ParamDef>): string[] {
  const lines: string[] = [];
  lines.push(`const ${name} = z.object({`);

  for (const [paramName, paramDef] of Object.entries(params)) {
    const camelParamName = toCamelCase(paramName);
    const comment = paramDef.note ? ` // ${paramDef.note}` : "";

    if (camelParamName !== paramName) {
      lines.push(`  ${camelParamName}: ${getZodTypeForParam(paramDef)},${comment} // maps to: ${paramName}`);
    } else {
      lines.push(`  ${paramName}: ${getZodTypeForParam(paramDef)},${comment}`);
    }
  }

  lines.push("});");
  return lines;
}

/** ---- Generate mock test parameters from parameter definitions ---- */
export function generateMockParams(params: Record<string, any>): string {
  const mockValues: string[] = [];

  for (const [paramName, paramDef] of Object.entries(params)) {
    const camelParamName = toCamelCase(paramName);
    let mockValue: string;

    switch (paramDef.type) {
      case "string":
        mockValue = '"test"';
        break;
      case "number":
        mockValue = "123";
        break;
      case "boolean":
        mockValue = "true";
        break;
      case "numbers":
        mockValue = "[123, 456]";
        break;
      default:
        mockValue = '"test"';
    }

    mockValues.push(`${camelParamName}: ${mockValue}`);
  }

  return mockValues.length > 0 ? `{\n  ${mockValues.join(",\n  ")}\n      }` : "{}";
}

/** ---- Generate service test file ---- */
export function generateSectionTest(sectionName: string, endpoints: Flat[]): string {
  const lines: string[] = [];

  lines.push(`import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";`);
  lines.push(`import { ${toPascal(sectionName)}Service } from "./service";`);
  lines.push(`import { IRacingClient } from "../client";`);
  lines.push("");

  const sampleImports: string[] = [];
  for (const ep of endpoints) {
    if (ep.samplePath) {
      const importName = toCamelCase(ep.method) + "Sample";
      const relativePath = `../../${ep.samplePath}`;
      sampleImports.push(`import ${importName} from "${relativePath}";`);
    }
  }

  if (sampleImports.length > 0) {
    lines.push("// Import sample data");
    lines.push(...sampleImports);
    lines.push("");
  }

  lines.push(`describe("${toPascal(sectionName)}Service", () => {`);
  lines.push("  let mockFetch: MockInstance;");
  lines.push("  let client: IRacingClient;");
  lines.push(`  let ${toCamelCase(sectionName)}Service: ${toPascal(sectionName)}Service;`);
  lines.push("");
  lines.push("  beforeEach(() => {");
  lines.push("    mockFetch = vi.fn();");
  lines.push("");
  lines.push("    client = new IRacingClient({");
  lines.push("      auth: {");
  lines.push('        type: "authorization-code",');
  lines.push('        clientId: "test-client-id",');
  lines.push('        clientSecret: "test-client-secret",');
  lines.push("        tokens: {");
  lines.push('          accessToken: "test-access-token",');
  lines.push('          refreshToken: "test-refresh-token",');
  lines.push("          expiresAt: Math.floor(Date.now() / 1000) + 3600,");
  lines.push("        },");
  lines.push("      },");
  lines.push("      fetchFn: mockFetch as any,");
  lines.push("      validateParams: false,");
  lines.push("      validateSemanticParams: false,");
  lines.push("    });");
  lines.push("");
  lines.push(`    ${toCamelCase(sectionName)}Service = new ${toPascal(sectionName)}Service(client);`);
  lines.push("  });");
  lines.push("");

  for (const endpoint of endpoints) {
    const methodName = toCamelCase(endpoint.name.replace(/\./g, "_"));
    const sampleName = toCamelCase(endpoint.method) + "Sample";
    const mockParams = generateMockParams(endpoint.params);
    const shouldPassParams = hasRequiredParams(endpoint.params);

    lines.push(`  describe("${methodName}()", () => {`);

    if (endpoint.samplePath) {
      lines.push(`    it("should fetch and validate ${sectionName} ${methodName} data", async () => {`);
      lines.push("      mockFetch.mockResolvedValueOnce({");
      lines.push("        ok: true,");
      lines.push('        headers: { get: () => "application/json" },');
      lines.push(`        json: () => Promise.resolve(${sampleName})`);
      lines.push("      });");
      lines.push("");

      if (shouldPassParams) {
        lines.push("      const testParams = " + mockParams + ";");
        lines.push(`      const result = await ${toCamelCase(sectionName)}Service.${methodName}(testParams);`);
      } else {
        lines.push(`      const result = await ${toCamelCase(sectionName)}Service.${methodName}();`);
      }

      lines.push("");
      lines.push("      expect(mockFetch).toHaveBeenCalledWith(");
      if (shouldPassParams) {
        lines.push(`        expect.stringContaining("${endpoint.url}"),`);
      } else {
        lines.push(`        "${endpoint.url}",`);
      }
      lines.push("        expect.objectContaining({");
      lines.push("          headers: expect.objectContaining({");
      lines.push('            Authorization: "Bearer test-access-token"');
      lines.push("          })");
      lines.push("        })");
      lines.push("      );");
      lines.push("");
      lines.push("      expect(result).toBeDefined();");
      lines.push('      expect(typeof result).toBe("object");');
      lines.push("    });");
    } else {
      lines.push(`    it("should fetch ${sectionName} ${methodName} data", async () => {`);
      lines.push("      mockFetch.mockResolvedValueOnce({");
      lines.push("        ok: true,");
      lines.push('        headers: { get: () => "application/json" },');
      lines.push("        json: () => Promise.resolve({})");
      lines.push("      });");
      lines.push("");

      if (shouldPassParams) {
        lines.push("      const testParams = " + mockParams + ";");
        lines.push(`      await ${toCamelCase(sectionName)}Service.${methodName}(testParams);`);
      } else {
        lines.push(`      await ${toCamelCase(sectionName)}Service.${methodName}();`);
      }

      lines.push("      expect(mockFetch).toHaveBeenCalledWith(");
      if (shouldPassParams) {
        lines.push(`        expect.stringContaining("${endpoint.url}"),`);
      } else {
        lines.push(`        "${endpoint.url}",`);
      }
      lines.push("        expect.objectContaining({");
      lines.push("          headers: expect.objectContaining({");
      lines.push('            Authorization: "Bearer test-access-token"');
      lines.push("          })");
      lines.push("        })");
      lines.push("      );");
      lines.push("    });");
    }

    lines.push("  });");
    lines.push("");
  }

  lines.push("});");
  return lines.join("\n");
}

/** ---- Generate service class file ---- */
export function generateSectionService(sectionName: string, endpoints: Flat[]): string {
  const lines: string[] = [];
  const semanticPairValidationMethods = new Set([
    "seasonDriverStandings",
    "seasonSupersessionStandings",
    "seasonTeamStandings",
    "seasonTtStandings",
    "seasonTtResults",
    "seasonQualifyResults",
  ]);

  lines.push(`import type { IRacingClient } from "../client";`);

  const paramImports: string[] = [];
  const responseImports: string[] = [];
  const schemaImports: string[] = [];
  let hasAnyParams = false;
  for (const endpoint of endpoints) {
    const methodName = toCamelCase(endpoint.name.split(".").pop() || "");
    const pascalMethodName = toPascal(methodName);
    const hasParams = Object.keys(endpoint.params).length > 0;

    if (hasParams) {
      hasAnyParams = true;
      paramImports.push(`${toPascal(sectionName)}${pascalMethodName}Params`);
    }

    if (endpoint.responseType) {
      const schemaName = endpoint.responseType.replace("Response", "");
      responseImports.push(`${endpoint.responseType}`);
      if (endpoint.samplePath) {
        schemaImports.push(schemaName);
      }
    }
  }

  const typeImports = [...paramImports, ...responseImports];

  if (typeImports.length > 0) {
    lines.push(`import type { ${typeImports.join(", ")} } from "./types";`);
  }
  if (hasAnyParams) {
    lines.push(`import * as z from "zod/mini";`);
  }
  if (schemaImports.length > 0) {
    lines.push(`import { ${schemaImports.join(", ")} } from "./types";`);
  }

  const paramValidatorBlocks: string[] = [];
  for (const endpoint of endpoints) {
    if (Object.keys(endpoint.params).length === 0) continue;
    const methodName = toCamelCase(endpoint.name.split(".").pop() || "");
    const validatorName = `${methodName}Params`;
    paramValidatorBlocks.push(generateParamValidator(validatorName, endpoint.params).join("\n"));
  }

  if (paramValidatorBlocks.length > 0) {
    lines.push("");
    lines.push(paramValidatorBlocks.join("\n\n"));
  }

  lines.push("");
  lines.push(`export class ${toPascal(sectionName)}Service {`);
  lines.push("  constructor(private client: IRacingClient) {}");
  lines.push("");

  for (const endpoint of endpoints) {
    const methodName = toCamelCase(endpoint.name.split(".").pop() || "");
    const pascalMethodName = toPascal(methodName);
    const paramsType = `${toPascal(sectionName)}${pascalMethodName}Params`;
    const paramsValidator = `${methodName}Params`;
    const responseType = endpoint.responseType || "unknown";
    const hasParams = Object.keys(endpoint.params).length > 0;
    const paramsAreRequired = hasRequiredParams(endpoint.params);
    const schemaName = endpoint.responseType && endpoint.samplePath ? endpoint.responseType.replace("Response", "") : null;

    lines.push(`  /**`);
    const endpointMethod = endpoint.name.split(".").pop() || "";
    lines.push(`   * ${endpointMethod}`);
    lines.push(`   * @see ${endpoint.url}`);
    if (endpoint.samplePath) {
      lines.push(`   * @sample ${endpoint.samplePath.replace("samples/", "")}`);
    }
    lines.push(`   */`);

    if (hasParams) {
      lines.push(`  async ${methodName}(params${paramsAreRequired ? "" : "?"}: ${paramsType}): Promise<${responseType}> {`);
    } else {
      lines.push(`  async ${methodName}(): Promise<${responseType}> {`);
    }

    if (hasParams) {
      if (sectionName === "stats" && semanticPairValidationMethods.has(methodName)) {
        lines.push(`    await this.client.ensureSeasonCarClassPair('stats.${endpoint.name.split(".").pop()}', params.seasonId, params.carClassId);`);
      }
      if (schemaName) {
        lines.push(`    return this.client.get<${responseType}>("${endpoint.url}", { params, paramsValidator: ${paramsValidator}, schema: ${schemaName} });`);
      } else {
        lines.push(`    return this.client.get<${responseType}>("${endpoint.url}", { params, paramsValidator: ${paramsValidator} });`);
      }
    } else {
      if (schemaName) {
        lines.push(`    return this.client.get<${responseType}>("${endpoint.url}", { schema: ${schemaName} });`);
      } else {
        lines.push(`    return this.client.get<${responseType}>("${endpoint.url}");`);
      }
    }
    lines.push("  }");
    lines.push("");
  }

  lines.push("}");
  return lines.join("\n");
}
