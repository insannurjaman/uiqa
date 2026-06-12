import type { File } from "@babel/types";

export type FindingSeverity = "low" | "medium" | "high";

export type FindingCategory = "ux" | "design-system" | "accessibility";

export type Finding = {
  ruleId: string;
  title: string;
  severity: FindingSeverity;
  filePath: string;
  line?: number;
  column?: number;
  message: string;
  suggestion: string;
  category: FindingCategory;
};

export type RuleContext = {
  filePath: string;
  source: string;
  ast: File;
};

export type Rule = {
  id: string;
  title: string;
  category: FindingCategory;
  severity: FindingSeverity;
  run(context: RuleContext): Finding[];
};

export type ReportFormat = "markdown" | "json";

export type ScanConfig = {
  path: string;
  format: ReportFormat;
  output?: string;
  failOn?: FindingSeverity;
  include: string[];
  ignore: string[];
};

export type ScanResult = {
  config: ScanConfig;
  scannedFiles: number;
  findings: Finding[];
};

export type CliOptions = Partial<{
  path: string;
  format: ReportFormat;
  output: string;
  failOn: FindingSeverity;
  config: string;
}>;
