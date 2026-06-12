import fs from "node:fs/promises";
import { discoverFiles } from "./files.js";
import { parseSource } from "./parser.js";
import type { Rule, ScanConfig, ScanResult } from "./types.js";
import { rules as defaultRules } from "../rules/index.js";

export async function scan(config: ScanConfig, scanRules: Rule[] = defaultRules, cwd = process.cwd()): Promise<ScanResult> {
  const files = await discoverFiles(config, cwd);
  const findings = [];

  for (const filePath of files) {
    const source = await fs.readFile(filePath, "utf8");
    const ast = parseSource(source, filePath);
    const context = { filePath, source, ast };

    for (const rule of scanRules) {
      findings.push(...rule.run(context));
    }
  }

  return {
    config,
    scannedFiles: files.length,
    findings
  };
}
