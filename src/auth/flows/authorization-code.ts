import { OAUTH_ENDPOINTS } from '../constants';
import { generatePKCE, maskClientSecret } from '../crypto';
import { OAuthError } from '../errors';
import type { TokenResponse, PKCEPair, FetchLike } from '../types';
import { TokenResponseSchema } from '../types';

export interface AuthorizationUrlOptions {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
  usePKCE?: boolean;
}

export interface AuthorizationUrlResult {
  url: string;
  state: string;
  pkce?: PKCEPair;
}

/**
 * Builds the authorization URL for the Authorization Code flow.
 */
export async function buildAuthorizationUrl(
  options: AuthorizationUrlOptions
): Promise<AuthorizationUrlResult> {
  const { clientId, redirectUri, scope, usePKCE = true } = options;
  const state = options.state ?? crypto.randomUUID();

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
  });

  if (scope) {
    params.set('scope', scope);
  }

  let pkce: PKCEPair | undefined;
  if (usePKCE) {
    pkce = await generatePKCE();
    params.set('code_challenge', pkce.challenge);
    params.set('code_challenge_method', 'S256');
  }

  return {
    url: `${OAUTH_ENDPOINTS.authorize}?${params.toString()}`,
    state,
    pkce,
  };
}

export interface CodeExchangeOptions {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
  codeVerifier?: string;
  fetchFn?: FetchLike;
}

/**
 * Exchanges an authorization code for tokens.
 * The client_secret is masked with the client_id before transmission.
 */
export async function exchangeAuthorizationCode(
  options: CodeExchangeOptions
): Promise<TokenResponse> {
  const { clientId, clientSecret, code, redirectUri, codeVerifier } = options;
  const fetchFn = options.fetchFn ?? globalThis.fetch;

  const maskedSecret = await maskClientSecret(clientId, clientSecret);

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: maskedSecret,
    code: code,
    redirect_uri: redirectUri,
  });

  if (codeVerifier) {
    body.set('code_verifier', codeVerifier);
  }

  const response = await fetchFn(OAUTH_ENDPOINTS.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new OAuthError(data.error, data.error_description, data.error_uri);
  }

  // Validate response structure
  return TokenResponseSchema.parse(data);
}
