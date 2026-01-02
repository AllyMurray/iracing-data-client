import type { PKCEPair } from './types';

/**
 * Masks a secret using iRacing's masking algorithm.
 *
 * Both password and client_secret must be masked before transmission.
 * - For password: identifier is the username (email)
 * - For client_secret: identifier is the client_id
 *
 * Algorithm: Base64(SHA256(secret + normalize(identifier)))
 * where normalize = trim + lowercase
 *
 * @param secret - The secret to mask (password or client_secret)
 * @param identifier - The identifier to use (username or client_id)
 * @returns Base64-encoded SHA-256 hash
 *
 * @see https://oauth.iracing.com/oauth2/book/token_endpoint.html
 */
export async function maskSecret(secret: string, identifier: string): Promise<string> {
  const normalizedId = identifier.trim().toLowerCase();
  const combined = secret + normalizedId;

  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Standard Base64 encoding (NOT URL-safe variant)
  return btoa(String.fromCharCode(...hashArray));
}

/**
 * Masks the password with the username.
 * Convenience wrapper around maskSecret.
 */
export async function maskPassword(username: string, password: string): Promise<string> {
  return maskSecret(password, username);
}

/**
 * Masks the client secret with the client ID.
 * Convenience wrapper around maskSecret.
 */
export async function maskClientSecret(clientId: string, clientSecret: string): Promise<string> {
  return maskSecret(clientSecret, clientId);
}

/**
 * Generates a cryptographically secure random string for PKCE verifier.
 * Uses unreserved URI characters per RFC 7636.
 *
 * @param length - Length of the string (43-128 per RFC 7636, default 64)
 */
export function generateRandomString(length: number = 64): string {
  const unreservedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (byte) => unreservedChars[byte % unreservedChars.length]).join(
    ''
  );
}

/**
 * Generates a PKCE code verifier and challenge pair.
 * The challenge is the Base64URL-encoded SHA-256 hash of the verifier.
 */
export async function generatePKCE(): Promise<PKCEPair> {
  const verifier = generateRandomString(64);

  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Base64URL encoding (no padding, URL-safe characters)
  const challenge = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return { verifier, challenge };
}
