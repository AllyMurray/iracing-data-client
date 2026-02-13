import { toPascal, toCamelCase, toKebab } from "./utils";

/** ---- Generate main Data Client class ---- */
export function generateMainDataClient(sections: string[]): string {
  const lines: string[] = [];

  lines.push(`/* AUTO-GENERATED — do not edit */`);
  lines.push(``);
  lines.push(`import { IRacingClient, IRacingError, type IRacingClientOptions } from "./client";`);

  // Import all service classes
  for (const section of sections) {
    const className = toPascal(section) + "Service";
    const dirName = toKebab(section);
    lines.push(`import { ${className} } from "./${dirName}/service";`);
  }

  lines.push(``);
  lines.push(`// Re-export client`);
  lines.push(`export { IRacingClient, IRacingError, type IRacingClientOptions };`);
  lines.push(``);
  lines.push(`// Re-export http-client-toolkit types`);
  lines.push(`export type { HttpClientStores } from '@http-client-toolkit/core';`);
  lines.push(``);
  lines.push(`// Re-export auth types and helpers`);
  lines.push(`export type {`);
  lines.push(`  AuthConfig,`);
  lines.push(`  PasswordLimitedAuth,`);
  lines.push(`  AuthorizationCodeAuth,`);
  lines.push(`  TokenResponse,`);
  lines.push(`  OnTokenRefresh,`);
  lines.push(`  FetchLike,`);
  lines.push(`} from "./auth";`);
  lines.push(``);
  lines.push(`export {`);
  lines.push(`  OAuthError,`);
  lines.push(`  TokenRefreshError,`);
  lines.push(`  buildAuthorizationUrl,`);
  lines.push(`  exchangeAuthorizationCode,`);
  lines.push(`} from "./auth";`);
  lines.push(``);

  // Export all types
  for (const section of sections) {
    const dirName = toKebab(section);
    lines.push(`export * from "./${dirName}/types";`);
  }

  lines.push(``);
  lines.push(`export class IRacingDataClient {`);
  lines.push(`  private client: IRacingClient;`);
  lines.push(``);

  // Declare service properties
  for (const section of sections) {
    const propName = toCamelCase(section);
    const className = toPascal(section) + "Service";
    lines.push(`  public ${propName}: ${className};`);
  }

  lines.push(``);
  lines.push(`  constructor(opts: IRacingClientOptions) {`);
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
