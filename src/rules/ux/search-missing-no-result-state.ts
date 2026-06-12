import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../../core/traverse.js";
import type { Finding, Rule } from "../../core/types.js";
import { EMPTY_STATE_KEYWORDS, SEARCH_KEYWORDS, createRuleFinding, dedupeFindings, getJsxAttribute, getJsxAttributeText, hasAnyKeyword } from "./helpers.js";

export const searchMissingNoResultStateRule: Rule = {
  id: "UX004",
  title: "Search UI missing no-result state",
  category: "ux",
  severity: "medium",
  run(context) {
    if (hasAnyKeyword(context.source, EMPTY_STATE_KEYWORDS)) {
      return [];
    }

    const findings: Finding[] = [];

    traverse(context.ast, {
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        const type = getJsxAttributeText(getJsxAttribute(path.node, "type")).toLowerCase();
        const placeholder = getJsxAttributeText(getJsxAttribute(path.node, "placeholder"));
        const ariaLabel = getJsxAttributeText(getJsxAttribute(path.node, "aria-label"));
        if (type === "search" || hasAnyKeyword(`${placeholder} ${ariaLabel}`, SEARCH_KEYWORDS)) {
          findings.push(
            createRuleFinding(
              searchMissingNoResultStateRule,
              context,
              path.node,
              "This search UI has no obvious no-result state.",
              "Show a no-results message when the query returns an empty result set."
            )
          );
        }
      },
      CallExpression(path: NodePath<t.CallExpression>) {
        if (t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.property, { name: "filter" })) {
          findings.push(
            createRuleFinding(
              searchMissingNoResultStateRule,
              context,
              path.node,
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
