import { OAUTH_ENDPOINTS, IRACING_AUTH_SCOPE } from '../constants';
import { maskClientSecret } from '../crypto';
import { OAuthError } from '../errors';
import type { TokenResponse, FetchLike } from '../types';
import { TokenResponseSchema } from '../types';

export interface RefreshTokenRequest {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  fetchFn: FetchLike;
}

/**
 * Exchanges a refresh token for new tokens.
 * Note: Refresh tokens are single-use.
 * The client_secret is masked with the client_id before transmission.
 */
export async function refreshTokens(options: RefreshTokenRequest): Promise<TokenResponse> {
  const { clientId, clientSecret, refreshToken, fetchFn } = options;

  const maskedSecret = await maskClientSecret(clientId, clientSecret);

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: maskedSecret,
    refresh_token: refreshToken,
    scope: IRACING_AUTH_SCOPE,
  });

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
