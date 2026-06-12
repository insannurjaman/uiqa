import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { CliOptions, ScanConfig } from "./types.js";

const severitySchema = z.enum(["low", "medium", "high"]);
const formatSchema = z.enum(["markdown", "json"]);

const configSchema = z
  .object({
    path: z.string().min(1).optional(),
    format: formatSchema.optional(),
    output: z.string().min(1).optional(),
    failOn: severitySchema.optional(),
    include: z.array(z.string().min(1)).optional(),
    ignore: z.array(z.string().min(1)).optional()
  })
  .strict();

export const DEFAULT_CONFIG: ScanConfig = {
  path: ".",
  format: "markdown",
  include: ["**/*.{ts,tsx,js,jsx}"],
  ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.next/**", "**/coverage/**"]
};

export function loadConfig(cwd: string, cliOptions: CliOptions = {}): ScanConfig {
  const configPath = resolveConfigPath(cwd, cliOptions.config);
  const fileConfig = configPath ? readConfigFile(configPath) : {};

  return {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    path: cliOptions.path ?? fileConfig.path ?? DEFAULT_CONFIG.path,
    format: cliOptions.format ?? fileConfig.format ?? DEFAULT_CONFIG.format,
    output: cliOptions.output ?? fileConfig.output,
    failOn: cliOptions.failOn ?? fileConfig.failOn,
    include: fileConfig.include ?? DEFAULT_CONFIG.include,
    ignore: fileConfig.ignore ?? DEFAULT_CONFIG.ignore
  };
}

function resolveConfigPath(cwd: string, explicitConfigPath?: string): string | undefined {
  if (explicitConfigPath) {
    const resolved = path.resolve(cwd, explicitConfigPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Config file not found: ${resolved}`);
    }
    return resolved;
  }

  const defaultPath = path.join(cwd, "uiqa.config.json");
  return fs.existsSync(defaultPath) ? defaultPath : undefined;
}

function readConfigFile(configPath: string): Partial<ScanConfig> {
  let raw: unknown;

  try {
    raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown JSON parse error";
    throw new Error(`Unable to read UIQA config at ${configPath}: ${reason}`);
  }

  const parsed = configSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join(".") || "config"}: ${issue.message}`).join("; ");
    throw new Error(`Invalid UIQA config at ${configPath}: ${details}`);
  }

  return parsed.data;
}
