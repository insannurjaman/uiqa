import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../core/traverse.js";
import type { Finding, Rule } from "../core/types.js";

const SPACING_PROPERTY_PATTERN = /^(m|p|margin|padding|gap|top|right|bottom|left|inset)(x|y|t|r|b|l)?$/i;
const RAW_PIXEL_PATTERN = /\b(?:margin|padding|gap|top|right|bottom|left|inset|width|height|minWidth|minHeight|maxWidth|maxHeight)\s*:\s*["']?\d+px\b/i;
const TAILWIND_ARBITRARY_SPACING_PATTERN = /\b(?:m|p|gap|space|top|right|bottom|left|inset|w|h|min-w|min-h|max-w|max-h)(?:[trblxy])?-\[\d+px\]/;

export const inconsistentSpacingTokenRule: Rule = {
  id: "DS002",
  title: "Inconsistent spacing token usage",
  category: "design-system",
  severity: "medium",
  run(context) {
    const findings: Finding[] = [];
    const seen = new Set<string>();

    traverse(context.ast, {
      StringLiteral(path: NodePath<t.StringLiteral>) {
        reportIfRawSpacing(path.node, path.node.value);
      },
      TemplateElement(path: NodePath<t.TemplateElement>) {
        reportIfRawSpacing(path.node, path.node.value.raw);
      },
      ObjectProperty(path: NodePath<t.ObjectProperty>) {
        const keyName = getObjectKeyName(path.node.key);
        if (!keyName || !SPACING_PROPERTY_PATTERN.test(keyName)) {
          return;
        }

        const value = path.node.value;
        if (t.isNumericLiteral(value) || (t.isStringLiteral(value) && /\d+px/.test(value.value))) {
          report(path.node);
        }
      }
    });

    function reportIfRawSpacing(node: t.Node, value: string): void {
      if (RAW_PIXEL_PATTERN.test(value) || TAILWIND_ARBITRARY_SPACING_PATTERN.test(value)) {
        report(node);
      }
    }

    function report(node: t.Node): void {
      const key = `${node.loc?.start.line ?? "?"}:${node.loc?.start.column ?? "?"}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);

      findings.push({
        ruleId: inconsistentSpacingTokenRule.id,
        title: inconsistentSpacingTokenRule.title,
        severity: inconsistentSpacingTokenRule.severity,
        filePath: context.filePath,
        line: node.loc?.start.line,
        column: node.loc ? node.loc.start.column + 1 : undefined,
        message: "Raw spacing values make layout rhythm harder to keep consistent across the product.",
        suggestion: "Use a design-system spacing token, scale class, or shared theme value instead of ad hoc pixel spacing.",
        category: inconsistentSpacingTokenRule.category
      });
    }

    return findings.slice(0, 1);
  }
};

function getObjectKeyName(key: t.ObjectProperty["key"]): string {
  if (t.isIdentifier(key)) {
    return key.name;
  }
  if (t.isStringLiteral(key)) {
    return key.value;
  }
  return "";
}
