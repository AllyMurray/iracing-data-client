#!/usr/bin/env npx tsx
/**
 * iRacing OAuth Test Script
 * 
 * Tests the OAuth2 Password Limited flow with your credentials.
 * 
 * Usage:
 *   npx tsx test-oauth.ts
 * 
 * Environment variables required:
 *   IRACING_CLIENT_ID     - Your OAuth client ID from iRacing
 *   IRACING_CLIENT_SECRET - Your OAuth client secret from iRacing
 *   IRACING_USERNAME      - Your iRacing email (must match client owner)
 *   IRACING_PASSWORD      - Your iRacing password
 */

import { requestPasswordLimitedToken } from './src/auth/flows/password-limited';
import { refreshTokens } from './src/auth/flows/refresh';

async function main() {
  const clientId = process.env.IRACING_CLIENT_ID;
  const clientSecret = process.env.IRACING_CLIENT_SECRET;
  const username = process.env.IRACING_USERNAME;
  const password = process.env.IRACING_PASSWORD;

  // Check required env vars
  const missing: string[] = [];
  if (!clientId) missing.push('IRACING_CLIENT_ID');
  if (!clientSecret) missing.push('IRACING_CLIENT_SECRET');
  if (!username) missing.push('IRACING_USERNAME');
  if (!password) missing.push('IRACING_PASSWORD');

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nSet them and try again:');
    console.error('  export IRACING_CLIENT_ID="your-client-id"');
    console.error('  export IRACING_CLIENT_SECRET="your-client-secret"');
    console.error('  export IRACING_USERNAME="your-email@example.com"');
    console.error('  export IRACING_PASSWORD="your-password"');
    process.exit(1);
  }

  console.log('🔐 Testing iRacing OAuth2 Password Limited Flow\n');
  console.log(`   Client ID: ${clientId!.slice(0, 8)}...`);
  console.log(`   Username:  ${username}`);
  console.log('');

  try {
    // Step 1: Get initial tokens
    console.log('1️⃣  Requesting tokens via Password Limited flow...');
    const tokens = await requestPasswordLimitedToken({
      clientId: clientId!,
      clientSecret: clientSecret!,
      username: username!,
      password: password!,
      fetchFn: fetch,
    });

    console.log('   ✅ Token received!');
    console.log(`   - Access token: ${tokens.access_token.slice(0, 20)}...`);
    console.log(`   - Token type: ${tokens.token_type}`);
    console.log(`   - Expires in: ${tokens.expires_in} seconds`);
    console.log(`   - Scope: ${tokens.scope || '(not specified)'}`);
    console.log(`   - Refresh token: ${tokens.refresh_token ? tokens.refresh_token.slice(0, 20) + '...' : '(none)'}`);
    console.log('');

    // Step 2: Test the token with an API call
    console.log('2️⃣  Testing token with API call (GET /data/member/info)...');
    const apiResponse = await fetch('https://members-ng.iracing.com/data/member/info', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log('   ✅ API call successful!');
      console.log(`   - Customer ID: ${data.cust_id}`);
      console.log(`   - Display Name: ${data.display_name}`);
      console.log('');
    } else {
      const error = await apiResponse.text();
      console.log(`   ❌ API call failed: ${apiResponse.status}`);
      console.log(`   - Response: ${error}`);
      console.log('');
    }

    // Step 3: Test token refresh (if we have a refresh token)
    if (tokens.refresh_token) {
      console.log('3️⃣  Testing token refresh...');
      const refreshed = await refreshTokens({
        clientId: clientId!,
        clientSecret: clientSecret!,
        refreshToken: tokens.refresh_token,
        fetchFn: fetch,
      });
      console.log('   ✅ Token refreshed!');
      console.log(`   - New access token: ${refreshed.access_token.slice(0, 20)}...`);
      console.log(`   - New refresh token: ${refreshed.refresh_token ? refreshed.refresh_token.slice(0, 20) + '...' : '(none)'}`);
      console.log('');
    }

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
