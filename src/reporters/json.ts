import type { ScanResult } from "../core/types.js";
import { calculateScore } from "./markdown.js";

export function formatJson(result: ScanResult): string {
  return `${JSON.stringify(
    {
      filesScanned: result.scannedFiles,
      score: calculateScore(result.findings),
      findings: result.findings,
      config: result.config
    },
    null,
    2
  )}\n`;
}
