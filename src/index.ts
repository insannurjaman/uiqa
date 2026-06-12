export type {
  Finding,
  FindingCategory,
  FindingSeverity,
  Rule,
  RuleContext,
  ScanConfig,
  ScanResult
} from "./core/types.js";

export { DEFAULT_CONFIG, loadConfig } from "./core/config.js";
export { discoverFiles } from "./core/files.js";
export { parseSource } from "./core/parser.js";
export { scan } from "./core/scanner.js";
export { rules } from "./rules/index.js";
export { uxRules } from "./rules/ux/index.js";
export { imageMissingAltRule } from "./rules/image-missing-alt.js";
export { interactiveMissingAccessibleLabelRule } from "./rules/interactive-missing-accessible-label.js";
export { hardcodedHexColorRule } from "./rules/hardcoded-hex-color.js";
export { inconsistentSpacingTokenRule } from "./rules/inconsistent-spacing-token.js";
export { formatJson } from "./reporters/json.js";
export { formatMarkdown } from "./reporters/markdown.js";
