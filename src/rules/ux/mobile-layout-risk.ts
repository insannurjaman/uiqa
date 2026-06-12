import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../../core/traverse.js";
import type { Finding, Rule } from "../../core/types.js";
import { RESPONSIVE_KEYWORDS, createRuleFinding, dedupeFindings, getJsxAttribute, getJsxAttributeText, getJsxElementName, hasAnyKeyword } from "./helpers.js";

const FIXED_WIDTH_PATTERN = /\b(width|minWidth)\s*:\s*["']?([4-9]\d{2,}|\d{4,})px|w-\[[4-9]\d{2,}px\]|min-w-\[[4-9]\d{2,}px\]|min-w-(?:96|screen|full)/;
const HORIZONTAL_RISK_PATTERN = /\bflex-row\b|\bwhitespace-nowrap\b|\boverflow-hidden\b/;

export const mobileLayoutRiskRule: Rule = {
  id: "UX008",
  title: "Mobile layout risk",
  category: "ux",
  severity: "medium",
  run(context) {
    const hasResponsiveCue = hasAnyKeyword(context.source, RESPONSIVE_KEYWORDS);
    const findings: Finding[] = [];

    traverse(context.ast, {
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        const name = getJsxElementName(path.node);
        const className = getJsxAttributeText(getJsxAttribute(path.node, "className"));

        if (name === "table" && !/overflow-x-auto|responsive/i.test(context.source)) {
          findings.push(
            createRuleFinding(
              mobileLayoutRiskRule,
              context,
              path.node,
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
              path.node,
              "This layout uses fixed or horizontal sizing without obvious responsive behavior.",
              "Use responsive classes, wrapping, flexible widths, or mobile-specific layout adjustments."
            )
          );
        }
      },
      ObjectProperty(path: NodePath<t.ObjectProperty>) {
        const keyName = t.isIdentifier(path.node.key) || t.isStringLiteral(path.node.key) ? ("name" in path.node.key ? path.node.key.name : path.node.key.value) : "";
        const value = path.node.value;
        if (!hasResponsiveCue && (keyName === "width" || keyName === "minWidth") && t.isNumericLiteral(value) && value.value >= 400) {
          findings.push(
            createRuleFinding(
              mobileLayoutRiskRule,
              context,
              path.node,
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
