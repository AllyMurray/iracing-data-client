const assert = require('node:assert/strict');

globalThis.fetch = async () => {
  throw new Error('Package checks must not make real network requests');
};

async function main() {
  const commonjs = require('iracing-data-client');
  const esm = await import('iracing-data-client');
  assert.deepEqual(
    Object.keys(esm).sort(),
    Object.keys(commonjs).sort(),
    'ESM and CommonJS must expose the same public exports',
  );

  for (const sdk of [commonjs, esm]) {
    for (const name of [
      'IRacingDataClient',
      'IRacingClient',
      'IRacingError',
      'OAuthError',
      'TokenRefreshError',
      'buildAuthorizationUrl',
      'exchangeAuthorizationCode',
    ]) {
      assert.equal(typeof sdk[name], 'function', `Missing public export: ${name}`);
    }
    assert.equal(typeof sdk.DEFAULT_RETRY_OPTIONS, 'object');
    assert.ok(sdk.CarGet, 'Missing public response schema');

    let requests = 0;
    const client = new sdk.IRacingDataClient({
      auth: {
        type: 'authorization-code',
        clientId: 'package-test',
        clientSecret: 'package-test',
        tokens: {
          accessToken: 'package-test',
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        },
      },
      fetchFn: async (url) => {
        requests++;
        assert.equal(String(url), 'https://members-ng.iracing.com/data/car/get');
        return new Response('[]', { headers: { 'content-type': 'application/json' } });
      },
    });

    for (const service of [
      'car',
      'carclass',
      'constants',
      'driverStatsByCategory',
      'hosted',
      'league',
      'lookup',
      'member',
      'results',
      'season',
      'series',
      'stats',
      'team',
      'timeAttack',
      'track',
    ]) {
      assert.ok(client[service], `Missing service: ${service}`);
    }
    assert.equal(requests, 0, 'Constructing a client must not make a request');
    assert.equal(client.getPendingRequestCount(), 0);
    assert.deepEqual(await client.car.get(), []);
    assert.equal(requests, 1, 'The installed client must use the injected fetch');
  }
  console.log('Installed ESM and CommonJS clients passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
