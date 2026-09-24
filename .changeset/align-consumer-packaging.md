---
"iracing-data-client": patch
---

Mark the package as free of import-time side effects so bundlers can remove unused imports, and pin the HTTP toolkit runtime dependency to the reviewed 4.2.0 release. Preserve support for every Node.js version from 22 onward.
