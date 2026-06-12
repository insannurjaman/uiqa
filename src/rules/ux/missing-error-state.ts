import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../../core/traverse.js";
import type { Finding, Rule } from "../../core/types.js";
import { ERROR_KEYWORDS, createRuleFinding, dedupeFindings, getCallName } from "./helpers.js";

const VISIBLE_ERROR_PATTERN = /role=["']alert["']|aria-live|<[^>]*(Error|Alert|Toast|Message)|try again|failed|unable to|problem/i;

export const missingErrorStateRule: Rule = {
  id: "UX003",
  title: "Missing error state",
  category: "ux",
  severity: "high",
  run(context) {
    if (VISIBLE_ERROR_PATTERN.test(context.source)) {
      return [];
    }

    const findings: Finding[] = [];

    traverse(context.ast, {
      CatchClause(path: NodePath<t.CatchClause>) {
        findings.push(
          createRuleFinding(
            missingErrorStateRule,
            context,
            path.node,
            "This error path has no obvious user-facing error state.",
            "Show a visible error message with recovery guidance instead of only logging or swallowing the error."
          )
        );
      },
      CallExpression(path: NodePath<t.CallExpression>) {
        const callName = getCallName(path.node).toLowerCase();
        if (callName.includes("mutation") || callName.includes("query")) {
          findings.push(
            createRuleFinding(
              missingErrorStateRule,
              context,
              path.node,
              "This query or mutation pattern has no visible error handling.",
              "Render an error, retry, or recovery state when the request fails."
            )
          );
        }
      },
      Identifier(path: NodePath<t.Identifier>) {
        if (ERROR_KEYWORDS.includes(path.node.name.toLowerCase())) {
          findings.push(
            createRuleFinding(
              missingErrorStateRule,
              context,
              path.node,
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
