import path from "node:path";
import fg from "fast-glob";
import type { ScanConfig } from "./types.js";

export async function discoverFiles(config: ScanConfig, cwd = process.cwd()): Promise<string[]> {
  const scanRoot = path.resolve(cwd, config.path);
  const entries = await fg(config.include, {
    cwd: scanRoot,
    absolute: true,
    onlyFiles: true,
    ignore: config.ignore,
    dot: false
  });

  return entries.sort();
}
