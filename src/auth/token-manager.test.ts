import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TokenManager } from './token-manager';
import { TokenRefreshError } from './errors';

describe('TokenManager', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return valid token without refresh', async () => {
    const manager = new TokenManager({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      fetchFn: mockFetch,
    });

    const futureExpiry = Math.floor(Date.now() / 1000) + 300; // 5 min from now
    manager.setTokenState({
      accessToken: 'valid-token',
      refreshToken: 'refresh-token',
      expiresAt: futureExpiry,
      tokenType: 'Bearer',
    });

    const token = await manager.getAccessToken();
    expect(token).toBe('valid-token');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should refresh token when expiring soon', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 600,
        refresh_token: 'new-refresh-token',
      }),
    });

    const manager = new TokenManager({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      fetchFn: mockFetch,
    });

    // Token expires in 20 seconds (within 30s buffer)
    const soonExpiry = Math.floor(Date.now() / 1000) + 20;
    manager.setTokenState({
      accessToken: 'expiring-token',
      refreshToken: 'refresh-token',
      expiresAt: soonExpiry,
      tokenType: 'Bearer',
    });

    const token = await manager.getAccessToken();
    expect(token).toBe('new-access-token');
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should deduplicate concurrent refresh requests', async () => {
    let resolveRefresh: () => void;
    const refreshPromise = new Promise<void>((resolve) => {
      resolveRefresh = resolve;
    });

    mockFetch.mockImplementationOnce(async () => {
      await refreshPromise;
      return {
        ok: true,
        json: async () => ({
          access_token: 'new-token',
          token_type: 'Bearer',
          expires_in: 600,
          refresh_token: 'new-refresh',
        }),
      };
    });

    const manager = new TokenManager({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      fetchFn: mockFetch,
    });

    const expiredTime = Math.floor(Date.now() / 1000) - 10;
    manager.setTokenState({
      accessToken: 'expired-token',
      refreshToken: 'refresh-token',
      expiresAt: expiredTime,
      tokenType: 'Bearer',
    });

    // Start multiple concurrent requests
    const promise1 = manager.getAccessToken();
    const promise2 = manager.getAccessToken();
    const promise3 = manager.getAccessToken();

    // Resolve the refresh
    resolveRefresh!();

    const [token1, token2, token3] = await Promise.all([promise1, promise2, promise3]);

    // All should get same token
    expect(token1).toBe('new-token');
    expect(token2).toBe('new-token');
    expect(token3).toBe('new-token');

    // But only one fetch call was made
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should throw TokenRefreshError when no refresh token available', async () => {
    const manager = new TokenManager({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      fetchFn: mockFetch,
    });

    const expiredTime = Math.floor(Date.now() / 1000) - 10;
    manager.setTokenState({
      accessToken: 'expired-token',
      refreshToken: null, // No refresh token
      expiresAt: expiredTime,
      tokenType: 'Bearer',
    });

    await expect(manager.getAccessToken()).rejects.toThrow(TokenRefreshError);
  });

  it('should call onTokenRefresh callback when tokens are refreshed', async () => {
    const onTokenRefresh = vi.fn();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 600,
        refresh_token: 'new-refresh-token',
      }),
    });

    const manager = new TokenManager({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      fetchFn: mockFetch,
      onTokenRefresh,
    });

    const expiredTime = Math.floor(Date.now() / 1000) - 10;
    manager.setTokenState({
      accessToken: 'expired-token',
      refreshToken: 'refresh-token',
      expiresAt: expiredTime,
      tokenType: 'Bearer',
    });

    await manager.getAccessToken();

    expect(onTokenRefresh).toHaveBeenCalledWith(
      expect.objectContaining({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      })
    );
  });

  it('should report hasTokens correctly', () => {
    const manager = new TokenManager({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      fetchFn: mockFetch,
    });

    expect(manager.hasTokens()).toBe(false);

    manager.setTokenState({
      accessToken: 'token',
      refreshToken: null,
      expiresAt: Math.floor(Date.now() / 1000) + 300,
      tokenType: 'Bearer',
    });

    expect(manager.hasTokens()).toBe(true);

    manager.clearTokens();

    expect(manager.hasTokens()).toBe(false);
  });

  it('should report isTokenValid correctly', () => {
    const manager = new TokenManager({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      fetchFn: mockFetch,
    });

    expect(manager.isTokenValid()).toBe(false);

    // Token valid for 5 minutes
    manager.setTokenState({
      accessToken: 'token',
      refreshToken: null,
      expiresAt: Math.floor(Date.now() / 1000) + 300,
      tokenType: 'Bearer',
    });

    expect(manager.isTokenValid()).toBe(true);

    // Token expires in 20 seconds (within buffer)
    manager.setTokenState({
      accessToken: 'token',
      refreshToken: null,
      expiresAt: Math.floor(Date.now() / 1000) + 20,
      tokenType: 'Bearer',
    });

    expect(manager.isTokenValid()).toBe(false);
  });
});
