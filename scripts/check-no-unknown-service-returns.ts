#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";

const SRC_DIR = path.join(process.cwd(), "src");
const OFFENDING: Array<{ file: string; line: number; text: string }> = [];

function walk(dir: string): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.isFile() || entry.name !== "service.ts") {
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("Promise<unknown>")) {
        OFFENDING.push({
          file: path.relative(process.cwd(), fullPath),
          line: i + 1,
          text: lines[i].trim(),
        });
      }
    }
  }
}

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source directory not found: ${SRC_DIR}`);
  process.exit(1);
}

walk(SRC_DIR);

if (OFFENDING.length === 0) {
  console.log("No Promise<unknown> return types found in service files.");
  process.exit(0);
}

console.error("Found disallowed Promise<unknown> return types:");
for (const item of OFFENDING) {
  console.error(`- ${item.file}:${item.line} -> ${item.text}`);
}

process.exit(1);
