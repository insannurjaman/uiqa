import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../../core/traverse.js";
import type { Finding, Rule } from "../../core/types.js";
import { LOADING_KEYWORDS, createRuleFinding, dedupeFindings, getCallName, hasAnyKeyword } from "./helpers.js";

const DATA_CALLS = ["fetch", "usequery", "useswr", "useinfinitequery", "usemutation", "load", "loaddata"];

export const missingLoadingStateRule: Rule = {
  id: "UX002",
  title: "Missing loading state",
  category: "ux",
  severity: "medium",
  run(context) {
    if (hasAnyKeyword(context.source, LOADING_KEYWORDS)) {
      return [];
    }

    const findings: Finding[] = [];

    traverse(context.ast, {
      CallExpression(path: NodePath<t.CallExpression>) {
        const callName = getCallName(path.node).toLowerCase();
        if (DATA_CALLS.includes(callName) || callName.endsWith("query")) {
          findings.push(
            createRuleFinding(
              missingLoadingStateRule,
              context,
              path.node,
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
