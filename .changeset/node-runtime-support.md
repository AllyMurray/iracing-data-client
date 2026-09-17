---
"iracing-data-client": minor
---

Support Node.js 22 and 24 explicitly and remove support for older Node releases.
Consumers on Node.js 18 or 20 must upgrade to Node.js 22 or 24. Modern browser
support is unchanged. Repository development, builds, documentation, and releases
now use Node.js 24 and pnpm 12, with package compatibility checked on both supported
Node.js majors.
