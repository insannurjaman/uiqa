import path from "node:path";
import type { Finding, ScanResult } from "../core/types.js";

export function formatMarkdown(result: ScanResult, cwd = process.cwd()): string {
  const score = calculateScore(result.findings);
  const lines = ["# UIQA Report", "", `Score: ${score}/100`, `Scanned files: ${result.scannedFiles}`, `Findings: ${result.findings.length}`, ""];

  if (result.findings.length === 0) {
    lines.push("No UI/UX QA findings found.", "", "## Next Steps", "", "- Keep checking empty, loading, error, and recovery states as product flows change.", "");
    return lines.join("\n");
  }

  const counts = countBySeverity(result.findings);
  const categoryCounts = countByCategory(result.findings);
  lines.push(`Severity: ${counts.high} high, ${counts.medium} medium, ${counts.low} low`, "", "## Categories", "");
  for (const [category, count] of Object.entries(categoryCounts)) {
    if (count > 0) {
      lines.push(`- ${category}: ${count}`);
    }
  }

  lines.push("", "## Findings By Severity", "");

  for (const severity of ["high", "medium", "low"] as const) {
    const findings = result.findings.filter((finding) => finding.severity === severity);
    if (findings.length === 0) {
      continue;
    }

    lines.push(`### ${titleCase(severity)} (${findings.length})`, "");
    for (const finding of findings) {
      const location = formatLocation(finding, cwd);
      lines.push(`#### ${finding.ruleId}: ${finding.title}`, "");
      lines.push(`- Category: ${finding.category}`);
      lines.push(`- Location: ${location}`);
      lines.push(`- Message: ${finding.message}`);
      lines.push(`- Suggestion: ${finding.suggestion}`, "");
    }
  }

  lines.push("## Next Steps", "");
  for (const recommendation of getRecommendations(result.findings)) {
    lines.push(`- ${recommendation}`);
  }
  lines.push("");

  return lines.join("\n");
}

export function calculateScore(findings: Finding[]): number {
  const penalty = findings.reduce((total, finding) => {
    if (finding.severity === "high") {
      return total + 15;
    }
    if (finding.severity === "medium") {
      return total + 8;
    }
    return total + 3;
  }, 0);

  return Math.max(0, 100 - penalty);
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

function countByCategory(findings: Finding[]): Record<Finding["category"], number> {
  return findings.reduce(
    (counts, finding) => {
      counts[finding.category] += 1;
      return counts;
    },
    { ux: 0, "design-system": 0, accessibility: 0 }
  );
}

function getRecommendations(findings: Finding[]): string[] {
  const recommendations = new Set<string>();
  if (findings.some((finding) => finding.severity === "high")) {
    recommendations.add("Start with high severity findings before merging user-facing flows.");
  }
  if (findings.some((finding) => finding.category === "ux")) {
    recommendations.add("Add missing state, recovery, confirmation, or responsive behavior where the report flags UX risk.");
  }
  if (findings.some((finding) => finding.category === "accessibility")) {
    recommendations.add("Fix accessibility findings so core UI remains understandable to assistive technology.");
  }
  if (findings.some((finding) => finding.category === "design-system")) {
    recommendations.add("Replace hardcoded visual values with shared design tokens or theme values.");
  }

  return recommendations.size > 0 ? [...recommendations] : ["Review the listed findings and add focused tests or examples for the intended behavior."];
}

function titleCase(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
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
