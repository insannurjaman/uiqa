#!/usr/bin/env node
import fs from "node:fs/promises";
import { Command, InvalidArgumentError } from "commander";
import { loadConfig } from "../core/config.js";
import { scan } from "../core/scanner.js";
import type { FindingSeverity, ReportFormat } from "../core/types.js";
import { formatJson } from "../reporters/json.js";
import { formatMarkdown } from "../reporters/markdown.js";

const program = new Command();

program.name("uiqa").description("UI/UX QA checks for modern front-end projects.").version("0.1.0");

program
  .command("scan")
  .description("Scan a front-end project for UI/UX QA risks.")
  .option("--path <path>", "Path to scan")
  .option("--format <format>", "Report format: markdown or json", parseFormat)
  .option("--output <file>", "Write the report to a file")
  .option("--fail-on <severity>", "Exit with code 1 when findings meet this severity: low, medium, or high", parseSeverity)
  .option("--config <file>", "Path to a UIQA config file")
  .action(async (options) => {
    try {
      const cwd = process.cwd();
      const config = loadConfig(cwd, options);
      const result = await scan(config, undefined, cwd);
      const report = config.format === "json" ? formatJson(result) : formatMarkdown(result, cwd);

      if (config.output) {
        await fs.writeFile(config.output, report, "utf8");
      } else {
        process.stdout.write(report);
      }

      if (config.failOn && shouldFail(result.findings.map((finding) => finding.severity), config.failOn)) {
        process.exitCode = 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown UIQA error";
      process.stderr.write(`UIQA scan failed: ${message}\n`);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);

function parseFormat(value: string): ReportFormat {
  if (value === "markdown" || value === "json") {
    return value;
  }
  throw new InvalidArgumentError("Format must be markdown or json.");
}

function parseSeverity(value: string): FindingSeverity {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  throw new InvalidArgumentError("Severity must be low, medium, or high.");
}

function shouldFail(severities: FindingSeverity[], failOn: FindingSeverity): boolean {
  const rank: Record<FindingSeverity, number> = { low: 1, medium: 2, high: 3 };
  return severities.some((severity) => rank[severity] >= rank[failOn]);
}
