import { OAUTH_ENDPOINTS, IRACING_AUTH_SCOPE } from '../constants';
import { maskPassword, maskClientSecret } from '../crypto';
import { OAuthError } from '../errors';
import type { TokenResponse, FetchLike } from '../types';
import { TokenResponseSchema } from '../types';

export interface PasswordLimitedTokenRequest {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  fetchFn: FetchLike;
}

/**
 * Requests an access token using the Password Limited grant.
 *
 * Both the password and client_secret are masked before transmission:
 * - password: masked with username as identifier
 * - client_secret: masked with client_id as identifier
 */
export async function requestPasswordLimitedToken(
  options: PasswordLimitedTokenRequest
): Promise<TokenResponse> {
  const { clientId, clientSecret, username, password, fetchFn } = options;

  // Both password and client_secret must be masked
  const [maskedPassword, maskedClientSecret] = await Promise.all([
    maskPassword(username, password),
    maskClientSecret(clientId, clientSecret),
  ]);

  const body = new URLSearchParams({
    grant_type: 'password_limited',
    client_id: clientId,
    client_secret: maskedClientSecret,
    username: username,
    password: maskedPassword,
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
