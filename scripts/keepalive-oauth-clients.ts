#!/usr/bin/env tsx

import { DATA_API_BASE_URL } from "../src/auth/constants";
import { OAuthError } from "../src/auth/errors";
import { requestPasswordLimitedToken } from "../src/auth/flows/password-limited";

const CLIENTS_ENV_VAR = "IRACING_KEEPALIVE_CLIENTS";

interface KeepaliveClient {
  name: string;
  clientId: string;
  clientSecret: string;
  enabled: boolean;
}

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

async function main(): Promise<void> {
  const username = getRequiredEnv("IRACING_USERNAME");
  const password = getRequiredEnv("IRACING_PASSWORD");
  const clients = parseClientConfig(getRequiredEnv(CLIENTS_ENV_VAR));
  const enabledClients = clients.filter((client) => client.enabled);

  if (enabledClients.length === 0) {
    throw new ConfigError(`${CLIENTS_ENV_VAR} must contain at least one enabled client pair`);
  }

  console.log(
    `Loaded ${clients.length} configured client pair(s); ${enabledClients.length} enabled.`
  );
  console.log(`Using iRacing username ${maskIdentifier(username)}.`);

  const failures: string[] = [];

  for (const client of enabledClients) {
    const label = `${client.name} (${maskIdentifier(client.clientId)})`;
    console.log(`[${label}] Requesting token and calling /data/member/info...`);

    try {
      await keepClientAlive(client, username, password);
      console.log(`[${label}] Keepalive request succeeded.`);
    } catch (error) {
      const message = describeError(error);
      failures.push(`${label}: ${message}`);
      console.error(`[${label}] Keepalive request failed: ${message}`);
    }
  }

  if (failures.length > 0) {
    console.error(`${failures.length} of ${enabledClients.length} enabled client pair(s) failed.`);
    process.exit(1);
  }

  console.log(`All ${enabledClients.length} enabled client pair(s) succeeded.`);
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new ConfigError(`${name} must be set`);
  }
  return value;
}

function parseClientConfig(rawJson: string): KeepaliveClient[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    throw new ConfigError(
      `${CLIENTS_ENV_VAR} must be valid JSON: ${describeError(error)}`
    );
  }

  if (!Array.isArray(parsed)) {
    throw new ConfigError(`${CLIENTS_ENV_VAR} must be a JSON array`);
  }

  return parsed.map((entry, index) => normalizeClient(entry, index));
}

function normalizeClient(entry: unknown, index: number): KeepaliveClient {
  if (!isRecord(entry)) {
    throw new ConfigError(`${CLIENTS_ENV_VAR}[${index}] must be an object`);
  }

  const name = optionalStringField(entry, "name", index)?.trim() || `client-${index + 1}`;
  const enabled = optionalBooleanField(entry, "enabled", index) !== false;
  const clientId = optionalStringField(entry, "clientId", index)?.trim();
  const clientSecret = optionalStringField(entry, "clientSecret", index)?.trim();

  if (!enabled) {
    return {
      name,
      clientId: clientId || "disabled",
      clientSecret: clientSecret || "disabled",
      enabled,
    };
  }

  if (!clientId) {
    throw new ConfigError(`${CLIENTS_ENV_VAR}[${index}].clientId must be a non-empty string`);
  }

  if (!clientSecret) {
    throw new ConfigError(`${CLIENTS_ENV_VAR}[${index}].clientSecret must be a non-empty string`);
  }

  return { name, clientId, clientSecret, enabled };
}

function optionalStringField(
  entry: Record<string, unknown>,
  field: string,
  index: number
): string | undefined {
  const value = entry[field];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new ConfigError(`${CLIENTS_ENV_VAR}[${index}].${field} must be a string`);
  }
  return value;
}

function optionalBooleanField(
  entry: Record<string, unknown>,
  field: string,
  index: number
): boolean | undefined {
  const value = entry[field];
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") {
    throw new ConfigError(`${CLIENTS_ENV_VAR}[${index}].${field} must be a boolean`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function keepClientAlive(
  client: KeepaliveClient,
  username: string,
  password: string
): Promise<void> {
  const tokens = await requestPasswordLimitedToken({
    clientId: client.clientId,
    clientSecret: client.clientSecret,
    username,
    password,
    fetchFn: fetch,
  });

  const response = await fetch(`${DATA_API_BASE_URL}/data/member/info`, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Data API returned ${response.status} ${response.statusText || "Unknown"}`);
  }

  await response.arrayBuffer();
}

function maskIdentifier(value: string): string {
  if (value.includes("@")) {
    const [localPart, domain] = value.split("@", 2);
    return `${localPart.slice(0, 2)}***@${domain}`;
  }

  if (value.length <= 8) {
    return `${value.slice(0, 2)}...`;
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function describeError(error: unknown): string {
  if (error instanceof OAuthError) {
    return `${error.code}${error.description ? `: ${error.description}` : ""}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

main().catch((error) => {
  console.error(describeError(error));
  process.exit(1);
});
