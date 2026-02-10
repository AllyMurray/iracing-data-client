import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestPasswordLimitedToken } from './password-limited';
import { OAuthError } from '../errors';

describe('requestPasswordLimitedToken', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should request token with masked credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 600,
        refresh_token: 'test-refresh-token',
      }),
    });

    const result = await requestPasswordLimitedToken({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      username: 'user@example.com',
      password: 'password123',
      fetchFn: mockFetch,
    });

    expect(result.access_token).toBe('test-access-token');
    expect(result.token_type).toBe('Bearer');
    expect(result.expires_in).toBe(600);

    // Verify fetch was called with correct endpoint
    expect(mockFetch).toHaveBeenCalledWith(
      'https://oauth.iracing.com/oauth2/token',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );

    // Verify body contains masked credentials (not raw)
    const callArgs = mockFetch.mock.calls[0];
    const body = callArgs[1].body;
    expect(body).toContain('grant_type=password_limited');
    expect(body).toContain('client_id=test-client-id');
    expect(body).toContain('scope=iracing.auth');
    // Raw credentials should NOT appear in the body
    expect(body).not.toContain('password=password123');
    expect(body).not.toContain('client_secret=test-client-secret');
  });

  it('should throw OAuthError on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'invalid_grant',
        error_description: 'Invalid credentials',
      }),
    });

    await expect(
      requestPasswordLimitedToken({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        username: 'user@example.com',
        password: 'wrong-password',
        fetchFn: mockFetch,
      })
    ).rejects.toThrow(OAuthError);
  });

  it('should include error details in OAuthError', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'invalid_client',
        error_description: 'Client authentication failed',
        error_uri: 'https://oauth.iracing.com/docs/errors#invalid_client',
      }),
    });

    try {
      await requestPasswordLimitedToken({
        clientId: 'bad-client-id',
        clientSecret: 'bad-secret',
        username: 'user@example.com',
        password: 'password',
        fetchFn: mockFetch,
      });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(OAuthError);
      const oauthError = error as OAuthError;
      expect(oauthError.code).toBe('invalid_client');
      expect(oauthError.description).toBe('Client authentication failed');
      expect(oauthError.isInvalidClient).toBe(true);
    }
  });
});
