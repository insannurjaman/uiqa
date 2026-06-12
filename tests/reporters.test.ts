import { describe, expect, it } from "vitest";
import type { ScanResult } from "../src/core/types.js";
import { formatJson } from "../src/reporters/json.js";
import { formatMarkdown } from "../src/reporters/markdown.js";

const result: ScanResult = {
  config: {
    path: ".",
    format: "markdown",
    include: ["**/*.{ts,tsx,js,jsx}"],
    ignore: []
  },
  scannedFiles: 1,
  findings: [
    {
      ruleId: "A11Y001",
      title: "Image missing alt text",
      severity: "high",
      filePath: "/tmp/uiqa/App.tsx",
      line: 1,
      column: 20,
      message: "Image elements should include meaningful alt text.",
      suggestion: "Add an alt attribute.",
      category: "accessibility"
    }
  ]
};

describe("reporters", () => {
  it("formats markdown with summary and finding details", () => {
    const markdown = formatMarkdown(result, "/tmp/uiqa");

    expect(markdown).toContain("# UIQA Report");
    expect(markdown).toContain("Findings: 1");
    expect(markdown).toContain("A11Y001");
    expect(markdown).toContain("App.tsx:1:20");
  });

  it("formats parseable JSON", () => {
    const parsed = JSON.parse(formatJson(result)) as ScanResult;

    expect(parsed.findings[0]?.ruleId).toBe("A11Y001");
  });
});
