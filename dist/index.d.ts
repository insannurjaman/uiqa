import { File } from '@babel/types';

type FindingSeverity = "low" | "medium" | "high";
type FindingCategory = "ux" | "design-system" | "accessibility";
type Finding = {
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
type RuleContext = {
    filePath: string;
    source: string;
    ast: File;
};
type Rule = {
    id: string;
    title: string;
    category: FindingCategory;
    severity: FindingSeverity;
    run(context: RuleContext): Finding[];
};
type ReportFormat = "markdown" | "json";
type ScanConfig = {
    path: string;
    format: ReportFormat;
    output?: string;
    failOn?: FindingSeverity;
    include: string[];
    ignore: string[];
};
type ScanResult = {
    config: ScanConfig;
    scannedFiles: number;
    findings: Finding[];
};
type CliOptions = Partial<{
    path: string;
    format: ReportFormat;
    output: string;
    failOn: FindingSeverity;
    config: string;
}>;

declare const DEFAULT_CONFIG: ScanConfig;
declare function loadConfig(cwd: string, cliOptions?: CliOptions): ScanConfig;

declare function discoverFiles(config: ScanConfig, cwd?: string): Promise<string[]>;

declare function parseSource(source: string, filePath: string): File;

declare function scan(config: ScanConfig, scanRules?: Rule[], cwd?: string): Promise<ScanResult>;

declare const rules: Rule[];

declare const uxRules: Rule[];

declare function formatJson(result: ScanResult): string;

declare function formatMarkdown(result: ScanResult, cwd?: string): string;

export { DEFAULT_CONFIG, type Finding, type FindingCategory, type FindingSeverity, type Rule, type RuleContext, type ScanConfig, type ScanResult, discoverFiles, formatJson, formatMarkdown, loadConfig, parseSource, rules, scan, uxRules };
