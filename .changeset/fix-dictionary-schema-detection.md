---
"iracing-data-client": patch
---

Fix schema generator dictionary detection when merging multiple sample variations. Internal markers were breaking the numeric-key heuristic, causing dictionary schemas like `CarAssets` to generate as `z.unknown()` instead of typed schemas.
