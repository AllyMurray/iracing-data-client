#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";
import { toCamelCase, toPascal, toKebab } from "./generate-sdk/utils";
import { type Root, type Flat, type Endpoint, isEndpoint } from "./generate-sdk/types";
import { generateSectionService, generateSectionTest } from "./generate-sdk/service-generator";
import { generateClientBase } from "./generate-sdk/client-generator";
import { generateSectionTypes } from "./generate-sdk/section-types-generator";
import { generateMainDataClient } from "./generate-sdk/main-generator";

/** ---- CLI args ---- */
const INPUT = process.argv[2] ?? "docs/api/index.json";
const OUT_DIR = process.argv[3] ?? "src";
const SAMPLES_DIR = process.argv[4] ?? "samples";

const index: Root = JSON.parse(fs.readFileSync(INPUT, "utf8"));

function flatten(root: Root): Flat[] {
  const out: Flat[] = [];
  for (const [sectionName, section] of Object.entries(root)) {
    for (const [key, val] of Object.entries(section)) {
      if (isEndpoint(val)) {
        out.push(mk(sectionName, key, val));
      } else if (val && typeof val === "object") {
        for (const [k2, v2] of Object.entries(val)) {
          if (isEndpoint(v2)) out.push(mk(sectionName, `${key}.${k2}`, v2));
        }
      }
    }
  }
  return out;

  function mk(section: string, name: string, ep: Endpoint): Flat {
    const base = `${section}.${name}`;
    const method = toCamelCase(base.replace(/[^\w]/g, "_"));
    const sampleFile = `${SAMPLES_DIR}/${base}.json`;
    return {
      section,
      name,
      method,
      url: ep.link,
      params: ep.parameters || {},
      samplePath: fs.existsSync(sampleFile) ? sampleFile : undefined,
      responseType: fs.existsSync(sampleFile) ? `${toPascal(base.replace(/[^\w]/g, "_"))}Response` : undefined,
    };
  }
}

/** ---- Main execution ---- */
async function generateDataClient() {
  const endpoints = flatten(index);
  const bySection = new Map<string, Flat[]>();

  for (const ep of endpoints) {
    const list = bySection.get(ep.section) || [];
    list.push(ep);
    bySection.set(ep.section, list);
  }

  // Create output directories
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Generate client base
  fs.writeFileSync(path.join(OUT_DIR, "client.ts"), generateClientBase(), "utf8");
  console.log(`Generated ${OUT_DIR}/client.ts`);

  // Generate files for each section
  const sections: string[] = [];
  for (const [section, eps] of bySection) {
    sections.push(section);

    const dirName = toKebab(section);
    const sectionDir = path.join(OUT_DIR, dirName);

    // Create directory for this service
    fs.mkdirSync(sectionDir, { recursive: true });

    // Generate types file
    const typesFile = path.join(sectionDir, "types.ts");
    const typesContent = await generateSectionTypes(section, eps);
    fs.writeFileSync(typesFile, typesContent, "utf8");
    console.log(`Generated ${typesFile} with ${eps.length} endpoints`);

    // Generate service file
    const serviceFile = path.join(sectionDir, "service.ts");
    fs.writeFileSync(serviceFile, generateSectionService(section, eps), "utf8");
    console.log(`Generated ${serviceFile}`);

    // Generate test file
    const testFile = path.join(sectionDir, "service.test.ts");
    fs.writeFileSync(testFile, generateSectionTest(section, eps), "utf8");
    console.log(`Generated ${testFile}`);
  }

  // Generate main Data Client file
  fs.writeFileSync(path.join(OUT_DIR, "index.ts"), generateMainDataClient(sections), "utf8");
  console.log(`Generated ${OUT_DIR}/index.ts`);

  console.log(`\nSuccessfully generated typed Data Client with ${endpoints.length} endpoints across ${sections.length} sections!`);
}

// Run the generator
generateDataClient().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});