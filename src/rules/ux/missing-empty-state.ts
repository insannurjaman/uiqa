import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../../core/traverse.js";
import type { Finding, Rule } from "../../core/types.js";
import { EMPTY_STATE_KEYWORDS, createRuleFinding, dedupeFindings, getJsxElementName, hasAnyKeyword } from "./helpers.js";

export const missingEmptyStateRule: Rule = {
  id: "UX001",
  title: "Missing empty state",
  category: "ux",
  severity: "medium",
  run(context) {
    if (hasAnyKeyword(context.source, EMPTY_STATE_KEYWORDS) || /\b(length|size)\s*={0,3}\s*={2,3}\s*0/.test(context.source)) {
      return [];
    }

    const findings: Finding[] = [];

    traverse(context.ast, {
      CallExpression(path: NodePath<t.CallExpression>) {
        if (t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.property, { name: "map" })) {
          findings.push(
            createRuleFinding(
              missingEmptyStateRule,
              context,
              path.node,
              "This list renders mapped data without an obvious empty state.",
              "Add a fallback for zero items, such as a no-results message, onboarding prompt, or recovery action."
            )
          );
        }
      },
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        const name = getJsxElementName(path.node);
        if (name === "table" || name === "ul" || name === "ol") {
          findings.push(
            createRuleFinding(
              missingEmptyStateRule,
              context,
              path.node,
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
