// src/core/config.ts
import fs from "fs";
import path from "path";
import { z } from "zod";
var severitySchema = z.enum(["low", "medium", "high"]);
var formatSchema = z.enum(["markdown", "json"]);
var configSchema = z.object({
  path: z.string().min(1).optional(),
  format: formatSchema.optional(),
  output: z.string().min(1).optional(),
  failOn: severitySchema.optional(),
  include: z.array(z.string().min(1)).optional(),
  ignore: z.array(z.string().min(1)).optional()
}).strict();
var DEFAULT_CONFIG = {
  path: ".",
  format: "markdown",
  include: ["**/*.{ts,tsx,js,jsx}"],
  ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.next/**", "**/coverage/**"]
};
function loadConfig(cwd, cliOptions = {}) {
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
function resolveConfigPath(cwd, explicitConfigPath) {
  if (explicitConfigPath) {
    const resolved = path.resolve(cwd, explicitConfigPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Config file not found: ${resolved}`);
    }
    return resolved;
  }
  const defaultPath = path.join(cwd, "uiqa.config.json");
  return fs.existsSync(defaultPath) ? defaultPath : void 0;
}
function readConfigFile(configPath) {
  let raw;
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

// src/core/files.ts
import path2 from "path";
import fg from "fast-glob";
async function discoverFiles(config, cwd = process.cwd()) {
  const scanRoot = path2.resolve(cwd, config.path);
  const entries = await fg(config.include, {
    cwd: scanRoot,
    absolute: true,
    onlyFiles: true,
    ignore: config.ignore,
    dot: false
  });
  return entries.sort();
}

// src/core/parser.ts
import { parse } from "@babel/parser";
function parseSource(source, filePath) {
  return parse(source, {
    sourceType: "module",
    sourceFilename: filePath,
    errorRecovery: true,
    plugins: ["jsx", "typescript"]
  });
}

// src/core/scanner.ts
import fs2 from "fs/promises";

// src/rules/image-missing-alt.ts
import * as t from "@babel/types";

// src/core/traverse.ts
import traverseModule from "@babel/traverse";
var traverse = traverseModule.default ?? traverseModule;

// src/rules/image-missing-alt.ts
var imageMissingAltRule = {
  id: "A11Y001",
  title: "Image missing alt text",
  category: "accessibility",
  severity: "high",
  run(context) {
    const findings = [];
    traverse(context.ast, {
      JSXOpeningElement(path4) {
        const node = path4.node;
        if (!t.isJSXIdentifier(node.name) || node.name.name !== "img") {
          return;
        }
        const altAttribute = node.attributes.find((attribute) => {
          return t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name) && attribute.name.name === "alt";
        });
        if (hasMeaningfulAlt(altAttribute)) {
          return;
        }
        findings.push({
          ruleId: imageMissingAltRule.id,
          title: imageMissingAltRule.title,
          severity: imageMissingAltRule.severity,
          filePath: context.filePath,
          line: node.loc?.start.line,
          column: node.loc ? node.loc.start.column + 1 : void 0,
          message: "Image elements should include meaningful alt text.",
          suggestion: 'Add an alt attribute that describes the image, or use alt="" only for decorative images.',
          category: imageMissingAltRule.category
        });
      }
    });
    return findings;
  }
};
function hasMeaningfulAlt(attribute) {
  if (!attribute || !attribute.value) {
    return false;
  }
  if (t.isStringLiteral(attribute.value)) {
    return attribute.value.value.trim().length > 0;
  }
  if (t.isJSXExpressionContainer(attribute.value) && t.isStringLiteral(attribute.value.expression)) {
    return attribute.value.expression.value.trim().length > 0;
  }
  return true;
}

// src/rules/hardcoded-hex-color.ts
var HEX_COLOR_PATTERN = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
var hardcodedHexColorRule = {
  id: "DS001",
  title: "Hardcoded hex color",
  category: "design-system",
  severity: "medium",
  run(context) {
    const findings = [];
    const seenLocations = /* @__PURE__ */ new Set();
    traverse(context.ast, {
      StringLiteral(path4) {
        reportIfHexColor(path4.node, path4.node.value);
      },
      TemplateElement(path4) {
        reportIfHexColor(path4.node, path4.node.value.raw);
      },
      JSXText(path4) {
        reportIfHexColor(path4.node, path4.node.value);
      }
    });
    function reportIfHexColor(node, value) {
      if (!HEX_COLOR_PATTERN.test(value)) {
        return;
      }
      const line = node.loc?.start.line;
      const column = node.loc ? node.loc.start.column + 1 : void 0;
      const locationKey = `${line ?? "unknown"}:${column ?? "unknown"}:${value}`;
      if (seenLocations.has(locationKey)) {
        return;
      }
      seenLocations.add(locationKey);
      findings.push({
        ruleId: hardcodedHexColorRule.id,
        title: hardcodedHexColorRule.title,
        severity: hardcodedHexColorRule.severity,
        filePath: context.filePath,
        line,
        column,
        message: "Hardcoded hex colors make design-system updates harder to apply consistently.",
        suggestion: "Use a design token, CSS variable, or shared theme value instead of a raw hex color.",
        category: hardcodedHexColorRule.category
      });
    }
    return findings;
  }
};

// src/rules/ux/helpers.ts
import * as t2 from "@babel/types";
var EMPTY_STATE_KEYWORDS = ["empty", "no items", "no results", "no data", "nothing", "start by", "get started"];
var LOADING_KEYWORDS = ["loading", "isloading", "pending", "ispending", "skeleton", "spinner", "aria-busy"];
var ERROR_KEYWORDS = ["error", "alert", "failed", "failure", "try again", "unable to", "problem"];
var SEARCH_KEYWORDS = ["search", "query", "filter"];
var FORM_FEEDBACK_KEYWORDS = ["error", "invalid", "required", "helper", "hint", "validation", "aria-invalid", "aria-describedby"];
var CONFIRMATION_KEYWORDS = ["confirm", "confirmation", "dialog", "modal", "undo", "are you sure"];
var TRUST_KEYWORDS = ["secure", "security", "ssl", "encrypted", "refund", "support", "guarantee", "trusted", "card declined", "payment failed"];
var RESPONSIVE_KEYWORDS = ["sm:", "md:", "lg:", "xl:", "max-", "min-", "flex-wrap", "grid-cols-", "overflow-x-auto", "@media"];
function createRuleFinding(rule, context, node, message, suggestion) {
  return {
    ruleId: rule.id,
    title: rule.title,
    severity: rule.severity,
    filePath: context.filePath,
    line: node?.loc?.start.line,
    column: node?.loc ? node.loc.start.column + 1 : void 0,
    message,
    suggestion,
    category: rule.category
  };
}
function hasAnyKeyword(value, keywords) {
  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}
function getJsxElementName(node) {
  if (t2.isJSXIdentifier(node.name)) {
    return node.name.name;
  }
  if (t2.isJSXMemberExpression(node.name) && t2.isJSXIdentifier(node.name.property)) {
    return node.name.property.name;
  }
  return void 0;
}
function getJsxAttribute(node, name) {
  return node.attributes.find((attribute) => {
    return t2.isJSXAttribute(attribute) && t2.isJSXIdentifier(attribute.name) && attribute.name.name === name;
  });
}
function getJsxAttributeText(attribute) {
  if (!attribute?.value) {
    return "";
  }
  if (t2.isStringLiteral(attribute.value)) {
    return attribute.value.value;
  }
  if (t2.isJSXExpressionContainer(attribute.value)) {
    const expression = attribute.value.expression;
    if (t2.isStringLiteral(expression)) {
      return expression.value;
    }
    if (t2.isTemplateLiteral(expression)) {
      return expression.quasis.map((quasi) => quasi.value.raw).join(" ");
    }
  }
  return "";
}
function getCallName(node) {
  if (t2.isIdentifier(node.callee)) {
    return node.callee.name;
  }
  if (t2.isMemberExpression(node.callee) && t2.isIdentifier(node.callee.property)) {
    return node.callee.property.name;
  }
  return "";
}
function getIdentifierName(node) {
  if (t2.isIdentifier(node)) {
    return node.name;
  }
  if (t2.isJSXIdentifier(node)) {
    return node.name;
  }
  return "";
}
function dedupeFindings(findings) {
  const seen = /* @__PURE__ */ new Set();
  return findings.filter((finding) => {
    const key = `${finding.ruleId}:${finding.filePath}:${finding.line ?? "?"}:${finding.column ?? "?"}:${finding.message}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// src/rules/ux/checkout-missing-trust-recovery.ts
var CHECKOUT_PATTERN = /\b(checkout|payment|billing|credit card|invoice|subscribe|subscription)\b/i;
var checkoutMissingTrustRecoveryRule = {
  id: "UX007",
  title: "Checkout or payment flow missing trust or recovery cues",
  category: "ux",
  severity: "high",
  run(context) {
    if (!CHECKOUT_PATTERN.test(context.source) || hasAnyKeyword(context.source, TRUST_KEYWORDS)) {
      return [];
    }
    const findings = [];
    traverse(context.ast, {
      Identifier(path4) {
        if (CHECKOUT_PATTERN.test(getIdentifierName(path4.node))) {
          findings.push(
            createRuleFinding(
              checkoutMissingTrustRecoveryRule,
              context,
              path4.node,
              "This checkout or payment flow has no obvious trust or recovery cues.",
              "Add visible security, refund, support, or payment failure recovery copy near the payment action."
            )
          );
        }
      },
      JSXText(path4) {
        if (CHECKOUT_PATTERN.test(path4.node.value)) {
          findings.push(
            createRuleFinding(
              checkoutMissingTrustRecoveryRule,
              context,
              path4.node,
              "This checkout or payment UI has no obvious trust or recovery cues.",
              "Add reassurance such as secure payment copy, support contact, refund policy, or failed-payment recovery guidance."
            )
          );
        }
      }
    });
    return dedupeFindings(findings).slice(0, 1);
  }
};

// src/rules/ux/destructive-action-missing-confirmation.ts
import * as t3 from "@babel/types";
var DESTRUCTIVE_PATTERN = /\b(delete|remove|destroy|cancel|discard|archive)\b/i;
var destructiveActionMissingConfirmationRule = {
  id: "UX006",
  title: "Destructive action missing confirmation",
  category: "ux",
  severity: "high",
  run(context) {
    if (hasAnyKeyword(context.source, CONFIRMATION_KEYWORDS)) {
      return [];
    }
    const findings = [];
    traverse(context.ast, {
      JSXElement(path4) {
        const opening = path4.node.openingElement;
        const label = path4.node.children.map((child) => t3.isJSXText(child) ? child.value : "").join(" ");
        const ariaLabel = getJsxAttributeText(getJsxAttribute(opening, "aria-label"));
        if (DESTRUCTIVE_PATTERN.test(`${label} ${ariaLabel}`)) {
          findings.push(
            createRuleFinding(
              destructiveActionMissingConfirmationRule,
              context,
              opening,
              "This destructive action has no obvious confirmation or undo pattern.",
              "Require confirmation, show a dialog, or provide an undo path before completing destructive actions."
            )
          );
        }
      },
      Identifier(path4) {
        if (DESTRUCTIVE_PATTERN.test(path4.node.name)) {
          findings.push(
            createRuleFinding(
              destructiveActionMissingConfirmationRule,
              context,
              path4.node,
              "This destructive handler has no obvious confirmation or undo pattern.",
              "Add confirmation, a modal, or undo before the destructive operation is committed."
            )
          );
        }
      }
    });
    return dedupeFindings(findings).slice(0, 1);
  }
};

// src/rules/ux/form-missing-feedback.ts
var formMissingFeedbackRule = {
  id: "UX005",
  title: "Form missing validation or helper feedback",
  category: "ux",
  severity: "medium",
  run(context) {
    if (hasAnyKeyword(context.source, FORM_FEEDBACK_KEYWORDS)) {
      return [];
    }
    const findings = [];
    traverse(context.ast, {
      JSXOpeningElement(path4) {
        const name = getJsxElementName(path4.node);
        const type = getJsxAttributeText(getJsxAttribute(path4.node, "type")).toLowerCase();
        if (name === "form" || name === "button" && type === "submit") {
          findings.push(
            createRuleFinding(
              formMissingFeedbackRule,
              context,
              path4.node,
              "This form can be submitted without obvious validation or helper feedback.",
              "Add field-level validation, helper text, aria-invalid, or a visible form error message."
            )
          );
        }
      }
    });
    return dedupeFindings(findings).slice(0, 1);
  }
};

// src/rules/ux/missing-empty-state.ts
import * as t4 from "@babel/types";
var missingEmptyStateRule = {
  id: "UX001",
  title: "Missing empty state",
  category: "ux",
  severity: "medium",
  run(context) {
    if (hasAnyKeyword(context.source, EMPTY_STATE_KEYWORDS) || /\b(length|size)\s*={0,3}\s*={2,3}\s*0/.test(context.source)) {
      return [];
    }
    const findings = [];
    traverse(context.ast, {
      CallExpression(path4) {
        if (t4.isMemberExpression(path4.node.callee) && t4.isIdentifier(path4.node.callee.property, { name: "map" })) {
          findings.push(
            createRuleFinding(
              missingEmptyStateRule,
              context,
              path4.node,
              "This list renders mapped data without an obvious empty state.",
              "Add a fallback for zero items, such as a no-results message, onboarding prompt, or recovery action."
            )
          );
        }
      },
      JSXOpeningElement(path4) {
        const name = getJsxElementName(path4.node);
        if (name === "table" || name === "ul" || name === "ol") {
          findings.push(
            createRuleFinding(
              missingEmptyStateRule,
              context,
              path4.node,
              "This list-like UI has no obvious empty state copy.",
              "Show what happens when the collection is empty and guide the user toward the next useful action."
            )
          );
        }
      }
    });
    return dedupeFindings(findings).slice(0, 1);
  }
};

// src/rules/ux/missing-error-state.ts
var VISIBLE_ERROR_PATTERN = /role=["']alert["']|aria-live|<[^>]*(Error|Alert|Toast|Message)|try again|failed|unable to|problem/i;
var missingErrorStateRule = {
  id: "UX003",
  title: "Missing error state",
  category: "ux",
  severity: "high",
  run(context) {
    if (VISIBLE_ERROR_PATTERN.test(context.source)) {
      return [];
    }
    const findings = [];
    traverse(context.ast, {
      CatchClause(path4) {
        findings.push(
          createRuleFinding(
            missingErrorStateRule,
            context,
            path4.node,
            "This error path has no obvious user-facing error state.",
            "Show a visible error message with recovery guidance instead of only logging or swallowing the error."
          )
        );
      },
      CallExpression(path4) {
        const callName = getCallName(path4.node).toLowerCase();
        if (callName.includes("mutation") || callName.includes("query")) {
          findings.push(
            createRuleFinding(
              missingErrorStateRule,
              context,
              path4.node,
              "This query or mutation pattern has no visible error handling.",
              "Render an error, retry, or recovery state when the request fails."
            )
          );
        }
      },
      Identifier(path4) {
        if (ERROR_KEYWORDS.includes(path4.node.name.toLowerCase())) {
          findings.push(
            createRuleFinding(
              missingErrorStateRule,
              context,
              path4.node,
              "An error value is present but no visible error UI was found.",
              "Expose the error in the UI with clear copy and a next step."
            )
          );
        }
      }
    });
    return dedupeFindings(findings).slice(0, 1);
  }
};

// src/rules/ux/missing-loading-state.ts
var DATA_CALLS = ["fetch", "usequery", "useswr", "useinfinitequery", "usemutation", "load", "loaddata"];
var missingLoadingStateRule = {
  id: "UX002",
  title: "Missing loading state",
  category: "ux",
  severity: "medium",
  run(context) {
    if (hasAnyKeyword(context.source, LOADING_KEYWORDS)) {
      return [];
    }
    const findings = [];
    traverse(context.ast, {
      CallExpression(path4) {
        const callName = getCallName(path4.node).toLowerCase();
        if (DATA_CALLS.includes(callName) || callName.endsWith("query")) {
          findings.push(
            createRuleFinding(
              missingLoadingStateRule,
              context,
              path4.node,
              "This component appears to load data but has no visible loading state.",
              "Render a loading, skeleton, spinner, or pending state while data is unavailable."
            )
          );
        }
      }
    });
    return dedupeFindings(findings).slice(0, 1);
  }
};

// src/rules/ux/mobile-layout-risk.ts
import * as t5 from "@babel/types";
var FIXED_WIDTH_PATTERN = /\b(width|minWidth)\s*:\s*["']?([4-9]\d{2,}|\d{4,})px|w-\[[4-9]\d{2,}px\]|min-w-\[[4-9]\d{2,}px\]|min-w-(?:96|screen|full)/;
var HORIZONTAL_RISK_PATTERN = /\bflex-row\b|\bwhitespace-nowrap\b|\boverflow-hidden\b/;
var mobileLayoutRiskRule = {
  id: "UX008",
  title: "Mobile layout risk",
  category: "ux",
  severity: "medium",
  run(context) {
    const hasResponsiveCue = hasAnyKeyword(context.source, RESPONSIVE_KEYWORDS);
    const findings = [];
    traverse(context.ast, {
      JSXOpeningElement(path4) {
        const name = getJsxElementName(path4.node);
        const className = getJsxAttributeText(getJsxAttribute(path4.node, "className"));
        if (name === "table" && !/overflow-x-auto|responsive/i.test(context.source)) {
          findings.push(
            createRuleFinding(
              mobileLayoutRiskRule,
              context,
              path4.node,
              "This table may overflow on small screens.",
              "Wrap wide tables in horizontal scrolling or provide a responsive mobile layout."
            )
          );
        }
        if (!hasResponsiveCue && (FIXED_WIDTH_PATTERN.test(className) || HORIZONTAL_RISK_PATTERN.test(className))) {
          findings.push(
            createRuleFinding(
              mobileLayoutRiskRule,
              context,
              path4.node,
              "This layout uses fixed or horizontal sizing without obvious responsive behavior.",
              "Use responsive classes, wrapping, flexible widths, or mobile-specific layout adjustments."
            )
          );
        }
      },
      ObjectProperty(path4) {
        const keyName = t5.isIdentifier(path4.node.key) || t5.isStringLiteral(path4.node.key) ? "name" in path4.node.key ? path4.node.key.name : path4.node.key.value : "";
        const value = path4.node.value;
        if (!hasResponsiveCue && (keyName === "width" || keyName === "minWidth") && t5.isNumericLiteral(value) && value.value >= 400) {
          findings.push(
            createRuleFinding(
              mobileLayoutRiskRule,
              context,
              path4.node,
              "This layout uses a fixed width that may not fit mobile screens.",
              "Prefer fluid sizing with max-width constraints or responsive breakpoints."
            )
          );
        }
      }
    });
    return dedupeFindings(findings).slice(0, 1);
  }
};

// src/rules/ux/search-missing-no-result-state.ts
import * as t6 from "@babel/types";
var searchMissingNoResultStateRule = {
  id: "UX004",
  title: "Search UI missing no-result state",
  category: "ux",
  severity: "medium",
  run(context) {
    if (hasAnyKeyword(context.source, EMPTY_STATE_KEYWORDS)) {
      return [];
    }
    const findings = [];
    traverse(context.ast, {
      JSXOpeningElement(path4) {
        const type = getJsxAttributeText(getJsxAttribute(path4.node, "type")).toLowerCase();
        const placeholder = getJsxAttributeText(getJsxAttribute(path4.node, "placeholder"));
        const ariaLabel = getJsxAttributeText(getJsxAttribute(path4.node, "aria-label"));
        if (type === "search" || hasAnyKeyword(`${placeholder} ${ariaLabel}`, SEARCH_KEYWORDS)) {
          findings.push(
            createRuleFinding(
              searchMissingNoResultStateRule,
              context,
              path4.node,
              "This search UI has no obvious no-result state.",
              "Show a no-results message when the query returns an empty result set."
            )
          );
        }
      },
      CallExpression(path4) {
        if (t6.isMemberExpression(path4.node.callee) && t6.isIdentifier(path4.node.callee.property, { name: "filter" })) {
          findings.push(
            createRuleFinding(
              searchMissingNoResultStateRule,
              context,
              path4.node,
              "Filtered results are rendered without a no-result fallback.",
              "Add copy for searches that return zero matches and suggest how to recover."
            )
          );
        }
      }
    });
    return dedupeFindings(findings).slice(0, 1);
  }
};

// src/rules/ux/index.ts
var uxRules = [
  missingEmptyStateRule,
  missingLoadingStateRule,
  missingErrorStateRule,
  searchMissingNoResultStateRule,
  formMissingFeedbackRule,
  destructiveActionMissingConfirmationRule,
  checkoutMissingTrustRecoveryRule,
  mobileLayoutRiskRule
];

// src/rules/index.ts
var rules = [imageMissingAltRule, hardcodedHexColorRule, ...uxRules];

// src/core/scanner.ts
async function scan(config, scanRules = rules, cwd = process.cwd()) {
  const files = await discoverFiles(config, cwd);
  const findings = [];
  for (const filePath of files) {
    const source = await fs2.readFile(filePath, "utf8");
    const ast = parseSource(source, filePath);
    const context = { filePath, source, ast };
    for (const rule of scanRules) {
      findings.push(...rule.run(context));
    }
  }
  return {
    config,
    scannedFiles: files.length,
    findings
  };
}

// src/reporters/json.ts
function formatJson(result) {
  return `${JSON.stringify(result, null, 2)}
`;
}

// src/reporters/markdown.ts
import path3 from "path";
function formatMarkdown(result, cwd = process.cwd()) {
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
  for (const severity of ["high", "medium", "low"]) {
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
function calculateScore(findings) {
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
function countBySeverity(findings) {
  return findings.reduce(
    (counts, finding) => {
      counts[finding.severity] += 1;
      return counts;
    },
    { high: 0, medium: 0, low: 0 }
  );
}
function countByCategory(findings) {
  return findings.reduce(
    (counts, finding) => {
      counts[finding.category] += 1;
      return counts;
    },
    { ux: 0, "design-system": 0, accessibility: 0 }
  );
}
function getRecommendations(findings) {
  const recommendations = /* @__PURE__ */ new Set();
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
function titleCase(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
function formatLocation(finding, cwd) {
  const relativePath = path3.relative(cwd, finding.filePath) || finding.filePath;
  if (finding.line && finding.column) {
    return `${relativePath}:${finding.line}:${finding.column}`;
  }
  if (finding.line) {
    return `${relativePath}:${finding.line}`;
  }
  return relativePath;
}
export {
  DEFAULT_CONFIG,
  discoverFiles,
  formatJson,
  formatMarkdown,
  loadConfig,
  parseSource,
  rules,
  scan,
  uxRules
};
//# sourceMappingURL=index.js.map