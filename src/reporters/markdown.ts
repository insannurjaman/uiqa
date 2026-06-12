import path from "node:path";
import type { Finding, ScanResult } from "../core/types.js";

export function formatMarkdown(result: ScanResult, cwd = process.cwd()): string {
  const lines = ["# UIQA Report", "", `Scanned files: ${result.scannedFiles}`, `Findings: ${result.findings.length}`, ""];

  if (result.findings.length === 0) {
    lines.push("No UI/UX QA findings found.", "");
    return lines.join("\n");
  }

  const counts = countBySeverity(result.findings);
  lines.push(`Severity: ${counts.high} high, ${counts.medium} medium, ${counts.low} low`, "", "## Findings", "");

  for (const finding of result.findings) {
    const location = formatLocation(finding, cwd);
    lines.push(`### ${finding.ruleId}: ${finding.title}`, "");
    lines.push(`- Severity: ${finding.severity}`);
    lines.push(`- Category: ${finding.category}`);
    lines.push(`- Location: ${location}`);
    lines.push(`- Message: ${finding.message}`);
    lines.push(`- Suggestion: ${finding.suggestion}`, "");
  }

  return lines.join("\n");
}

function countBySeverity(findings: Finding[]): Record<Finding["severity"], number> {
  return findings.reduce(
    (counts, finding) => {
      counts[finding.severity] += 1;
      return counts;
    },
    { high: 0, medium: 0, low: 0 }
  );
}

function formatLocation(finding: Finding, cwd: string): string {
  const relativePath = path.relative(cwd, finding.filePath) || finding.filePath;
  if (finding.line && finding.column) {
    return `${relativePath}:${finding.line}:${finding.column}`;
  }
  if (finding.line) {
    return `${relativePath}:${finding.line}`;
  }
  return relativePath;
}
