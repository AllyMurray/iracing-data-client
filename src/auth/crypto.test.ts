import { describe, it, expect } from 'vitest';
import { maskSecret, maskPassword, maskClientSecret, generatePKCE, generateRandomString } from './crypto';

describe('maskSecret', () => {
  it('should produce consistent hash for same inputs', async () => {
    const result1 = await maskSecret('password123', 'user@example.com');
    const result2 = await maskSecret('password123', 'user@example.com');
    expect(result1).toBe(result2);
  });

  it('should normalize identifier to lowercase', async () => {
    const result1 = await maskSecret('password123', 'User@Example.com');
    const result2 = await maskSecret('password123', 'user@example.com');
    expect(result1).toBe(result2);
  });

  it('should trim whitespace from identifier', async () => {
    const result1 = await maskSecret('password123', '  user@example.com  ');
    const result2 = await maskSecret('password123', 'user@example.com');
    expect(result1).toBe(result2);
  });

  it('should produce base64 encoded output', async () => {
    const result = await maskSecret('password', 'user');
    // Base64 uses A-Z, a-z, 0-9, +, /, and = for padding
    expect(result).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it('should produce different hashes for different inputs', async () => {
    const result1 = await maskSecret('password1', 'user@example.com');
    const result2 = await maskSecret('password2', 'user@example.com');
    expect(result1).not.toBe(result2);
  });

  it('should produce different hashes for different identifiers', async () => {
    const result1 = await maskSecret('password', 'user1@example.com');
    const result2 = await maskSecret('password', 'user2@example.com');
    expect(result1).not.toBe(result2);
  });
});

describe('maskPassword', () => {
  it('should mask password with username', async () => {
    const result = await maskPassword('user@example.com', 'mypassword');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should be equivalent to maskSecret with swapped arguments', async () => {
    const maskPasswordResult = await maskPassword('user@example.com', 'mypassword');
    const maskSecretResult = await maskSecret('mypassword', 'user@example.com');
    expect(maskPasswordResult).toBe(maskSecretResult);
  });
});

describe('maskClientSecret', () => {
  it('should mask client secret with client id', async () => {
    const result = await maskClientSecret('my-client-id', 'my-client-secret');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should be equivalent to maskSecret with swapped arguments', async () => {
    const maskClientSecretResult = await maskClientSecret('my-client-id', 'my-client-secret');
    const maskSecretResult = await maskSecret('my-client-secret', 'my-client-id');
    expect(maskClientSecretResult).toBe(maskSecretResult);
  });
});

describe('generateRandomString', () => {
  it('should generate string of specified length', () => {
    const result = generateRandomString(32);
    expect(result.length).toBe(32);
  });

  it('should default to 64 characters', () => {
    const result = generateRandomString();
    expect(result.length).toBe(64);
  });

  it('should only use unreserved URI characters', () => {
    const result = generateRandomString(100);
    // RFC 7636 unreserved characters: A-Z, a-z, 0-9, -, ., _, ~
    expect(result).toMatch(/^[A-Za-z0-9\-._~]+$/);
  });

  it('should generate unique values each time', () => {
    const result1 = generateRandomString();
    const result2 = generateRandomString();
    expect(result1).not.toBe(result2);
  });
});

describe('generatePKCE', () => {
  it('should generate verifier and challenge', async () => {
    const pkce = await generatePKCE();
    expect(pkce.verifier).toBeTruthy();
    expect(pkce.challenge).toBeTruthy();
    expect(pkce.verifier.length).toBe(64);
  });

  it('should use URL-safe base64 for challenge', async () => {
    const pkce = await generatePKCE();
    // URL-safe base64 uses - and _ instead of + and /, no padding
    expect(pkce.challenge).not.toMatch(/[+/=]/);
  });

  it('should generate unique values each time', async () => {
    const pkce1 = await generatePKCE();
    const pkce2 = await generatePKCE();
    expect(pkce1.verifier).not.toBe(pkce2.verifier);
    expect(pkce1.challenge).not.toBe(pkce2.challenge);
  });

  it('should generate verifier with valid characters', async () => {
    const pkce = await generatePKCE();
    // RFC 7636 unreserved characters
    expect(pkce.verifier).toMatch(/^[A-Za-z0-9\-._~]+$/);
  });
});
