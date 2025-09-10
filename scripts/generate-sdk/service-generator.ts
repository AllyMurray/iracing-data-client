import { toCamelCase, toPascal } from "./utils";
import type { Flat } from "./types";

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
        mockValue = '123';
        break;
      case "boolean":
        mockValue = 'true';
        break;
      case "numbers":
        mockValue = '[123, 456]';
        break;
      default:
        mockValue = '"test"';
    }

    mockValues.push(`${camelParamName}: ${mockValue}`);
  }

  return mockValues.length > 0 ? `{\n  ${mockValues.join(',\n  ')}\n      }` : '{}';
}

/** ---- Generate service test file ---- */
export function generateSectionTest(sectionName: string, endpoints: Flat[]): string {
  const lines: string[] = [];
  
  lines.push(`import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";`);
  lines.push(`import { ${toPascal(sectionName)}Service } from "./service";`);
  lines.push(`import { IRacingClient } from "../client";`);
  lines.push("");
  
  // Import sample data
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
  lines.push("    ");
  lines.push("    client = new IRacingClient({");
  lines.push('      email: "test@example.com",');
  lines.push('      password: "password",');
  lines.push("      fetchFn: mockFetch");
  lines.push("    });");
  lines.push("    ");
  lines.push(`    ${toCamelCase(sectionName)}Service = new ${toPascal(sectionName)}Service(client);`);
  lines.push("  });");
  lines.push("");
  
  // Generate tests for each endpoint
  for (const endpoint of endpoints) {
    
    const methodName = toCamelCase(endpoint.name.replace(/\./g, "_"));
    const sampleName = toCamelCase(endpoint.method) + "Sample";
    const mockParams = generateMockParams(endpoint.params);
    
    lines.push(`  describe("${methodName}()", () => {`);

    if (endpoint.samplePath) {
      lines.push(`    it("should fetch, transform, and validate ${sectionName} ${methodName} data", async () => {`);
    lines.push("      // Mock auth response");
    lines.push("      mockFetch.mockResolvedValueOnce({");
    lines.push("        ok: true,");
    lines.push("        json: () => Promise.resolve({");
    lines.push('          authcode: "test123",');
    lines.push('          ssoCookieValue: "cookie123",');
    lines.push('          email: "test@example.com"');
    lines.push("        })");
    lines.push("      });");
    lines.push("");
    lines.push("      // Mock API response with original snake_case format");
    lines.push("      mockFetch.mockResolvedValueOnce({");
    lines.push("        ok: true,");
    lines.push('        headers: { get: () => "application/json" },');
    lines.push(`        json: () => Promise.resolve(${sampleName})`);
    lines.push("      });");
    lines.push("");
    
    if (mockParams !== '{}') {
      lines.push("      const testParams = " + mockParams + ";");
      lines.push(`      const result = await ${toCamelCase(sectionName)}Service.${methodName}(testParams);`);
    } else {
      lines.push(`      const result = await ${toCamelCase(sectionName)}Service.${methodName}();`);
    }
    
    lines.push("");
    lines.push("      // Verify authentication call");
    lines.push("      expect(mockFetch).toHaveBeenCalledWith(");
    lines.push('        "https://members-ng.iracing.com/auth",');
    lines.push("        expect.objectContaining({");
    lines.push('          method: "POST",');
    lines.push('          headers: { "Content-Type": "application/json" },');
    lines.push('          body: JSON.stringify({ email: "test@example.com", password: "password" })');
    lines.push("        })");
    lines.push("      );");
    lines.push("");
    lines.push("      // Verify API call");
    const hasParams = mockParams !== '{}';
    if (hasParams) {
      lines.push("      expect(mockFetch).toHaveBeenCalledWith(");
      lines.push(`        expect.stringContaining("${endpoint.url}"),`);
      lines.push("        expect.objectContaining({");
      lines.push("          headers: expect.objectContaining({");
      lines.push('            Cookie: expect.stringContaining("irsso_membersv2=cookie123")');
      lines.push("          })");
      lines.push("        })");
      lines.push("      );");
    } else {
      lines.push("      expect(mockFetch).toHaveBeenCalledWith(");
      lines.push(`        "${endpoint.url}",`);
      lines.push("        expect.objectContaining({");
      lines.push("          headers: expect.objectContaining({");
      lines.push('            Cookie: expect.stringContaining("irsso_membersv2=cookie123")');
      lines.push("          })");
      lines.push("        })");
      lines.push("      );");
    }
    lines.push("");
    lines.push("      // Verify response structure and transformation");
    lines.push("      expect(result).toBeDefined();");
    lines.push('      expect(typeof result).toBe("object");');
    lines.push("    });");
    lines.push("");
    lines.push("    it(\"should handle schema validation errors\", async () => {");
    lines.push("      // Mock auth response");
    lines.push("      mockFetch.mockResolvedValueOnce({");
    lines.push("        ok: true,");
    lines.push("        json: () => Promise.resolve({");
    lines.push('          authcode: "test123",');
    lines.push('          ssoCookieValue: "cookie123",');
    lines.push('          email: "test@example.com"');
    lines.push("        })");
    lines.push("      });");
    lines.push("");
    lines.push("      // Mock invalid API response");
    lines.push("      mockFetch.mockResolvedValueOnce({");
    lines.push("        ok: true,");
    lines.push('        headers: { get: () => "application/json" },');
    lines.push('        json: () => Promise.resolve({ invalid: "data" })');
    lines.push("      });");
    lines.push("");
    
    if (mockParams !== '{}') {
      lines.push("      const testParams = " + mockParams + ";");
      lines.push(`      await expect(${toCamelCase(sectionName)}Service.${methodName}(testParams)).rejects.toThrow();`);
    } else {
      lines.push(`      await expect(${toCamelCase(sectionName)}Service.${methodName}()).rejects.toThrow();`);
    }
    
    lines.push("    });");
    } else {
      // No sample data - generate basic test
      lines.push(`    it("should fetch ${sectionName} ${methodName} data", async () => {`);
      lines.push("      // Mock auth response");
      lines.push("      mockFetch.mockResolvedValueOnce({");
      lines.push("        ok: true,");
      lines.push("        json: () => Promise.resolve({");
      lines.push('          authcode: "test123",');
      lines.push('          ssoCookieValue: "cookie123",');
      lines.push('          email: "test@example.com"');
      lines.push("        })");
      lines.push("      });");
      lines.push("");
      lines.push("      // Mock API response");
      lines.push("      mockFetch.mockResolvedValueOnce({");
      lines.push("        ok: true,");
      lines.push('        headers: { get: () => "application/json" },');
      lines.push("        json: () => Promise.resolve({})");
      lines.push("      });");
      lines.push("");

      if (mockParams !== '{}') {
        lines.push("      const testParams = " + mockParams + ";");
        lines.push(`      await ${toCamelCase(sectionName)}Service.${methodName}(testParams);`);
      } else {
        lines.push(`      await ${toCamelCase(sectionName)}Service.${methodName}();`);
      }

      lines.push("      expect(mockFetch).toHaveBeenCalled();");
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
  
  lines.push(`import type { IRacingClient } from "../client";`);
  
  // Import types and schemas - group params first, then responses
  const paramImports: string[] = [];
  const responseImports: string[] = [];
  const schemaImports: string[] = [];
  for (const endpoint of endpoints) {
    const methodName = toCamelCase(endpoint.name.split('.').pop() || '');
    const pascalMethodName = toPascal(methodName);
    const hasParams = Object.keys(endpoint.params).length > 0;
    
    // Only include param types if endpoint actually has parameters
    if (hasParams) {
      paramImports.push(`${toPascal(sectionName)}${pascalMethodName}Params`);
    }
    
    if (endpoint.responseType) {
      const schemaName = endpoint.responseType.replace('Response', '');
      responseImports.push(`${endpoint.responseType}`);
      schemaImports.push(schemaName);
    }
  }
  
  const typeImports = [...paramImports, ...responseImports];
  
  if (typeImports.length > 0) {
    lines.push(`import type { ${typeImports.join(", ")} } from "./types";`);
  }
  if (schemaImports.length > 0) {
    lines.push(`import { ${schemaImports.join(", ")} } from "./types";`);
  }
  
  lines.push("");
  lines.push(`export class ${toPascal(sectionName)}Service {`);
  lines.push("  constructor(private client: IRacingClient) {}");
  lines.push("");
  
  // Generate methods for each endpoint
  for (const endpoint of endpoints) {
    
    const methodName = toCamelCase(endpoint.name.split('.').pop() || '');
    const pascalMethodName = toPascal(methodName);
    const paramsType = `${toPascal(sectionName)}${pascalMethodName}Params`;
    const responseType = endpoint.responseType || 'unknown';
    const hasParams = Object.keys(endpoint.params).length > 0;
    const schemaName = endpoint.responseType ? endpoint.responseType.replace('Response', '') : null;
    
    // Add JSDoc comments
    lines.push(`  /**`);
    // Use snake_case version for method name in comment
    const endpointMethod = endpoint.name.split('.').pop() || '';
    lines.push(`   * ${endpointMethod}`);
    lines.push(`   * @see ${endpoint.url}`);
    if (endpoint.samplePath) {
      lines.push(`   * @sample ${endpoint.samplePath.replace('samples/', '')}`);
    }
    lines.push(`   */`);
    
    // Method signature
    if (hasParams) {
      lines.push(`  async ${methodName}(params: ${paramsType}): Promise<${responseType}> {`);
    } else {
      lines.push(`  async ${methodName}(): Promise<${responseType}> {`);
    }
    
    // Method body - single line format
    if (hasParams) {
      if (schemaName) {
        lines.push(`    return this.client.get<${responseType}>("${endpoint.url}", { params, schema: ${schemaName} });`);
      } else {
        lines.push(`    return this.client.get<${responseType}>("${endpoint.url}", { params });`);
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