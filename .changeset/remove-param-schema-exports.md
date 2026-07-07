---
"iracing-data-client": minor
---

Remove generated endpoint parameter schema exports from the public TypeScript surface.

This is a breaking change for TypeScript projects that imported generated `*ParamsSchema` values from service `types` modules. Runtime request parameter validation now uses private service-local validators instead, while exported endpoint parameter types remain available.

Optional-only parameter objects can now be omitted when calling service methods, `validateParams` now validates request parameters before making network requests, and the docs have been updated to reflect implemented opt-in caching/rate-limit stores.
