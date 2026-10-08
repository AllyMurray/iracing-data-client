// Exercise the dotenvx-scoped proxy override in a separate process because
// bootstrap replaces Node's global HTTP agents. All traffic stays on localhost.
const assert = require('node:assert/strict');
const http = require('node:http');
const events = require('node:events');
const { createRequire } = require('node:module');

async function main() {
  const requests = [];
  const proxy = http.createServer((request, response) => {
    requests.push(request.url);
    response.end('local proxy response');
  });
  proxy.listen(0, '127.0.0.1');
  await events.once(proxy, 'listening');
  try {
    process.env.GLOBAL_AGENT_HTTP_PROXY = `http://127.0.0.1:${proxy.address().port}`;
    process.env.GLOBAL_AGENT_NO_PROXY = '';
    const requireFromDotenvx = createRequire(process.argv[2]);
    requireFromDotenvx('global-agent').bootstrap();
    const body = await new Promise((resolve, reject) => {
      http
        .get('http://127.0.0.1:1/proxy-check', (response) => {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => resolve(Buffer.concat(chunks).toString()));
          response.on('error', reject);
        })
        .on('error', reject);
    });
    assert.equal(body, 'local proxy response');
    assert.deepEqual(requests, ['http://127.0.0.1:1/proxy-check']);
    console.log('Proxy bootstrap compatibility passed');
  } finally {
    proxy.closeAllConnections();
    await new Promise((resolve) => proxy.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
