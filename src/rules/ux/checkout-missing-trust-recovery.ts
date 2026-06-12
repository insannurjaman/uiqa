import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../../core/traverse.js";
import type { Finding, Rule } from "../../core/types.js";
import { TRUST_KEYWORDS, createRuleFinding, dedupeFindings, getIdentifierName, hasAnyKeyword } from "./helpers.js";

const CHECKOUT_PATTERN = /\b(checkout|payment|billing|credit card|invoice|subscribe|subscription)\b/i;

export const checkoutMissingTrustRecoveryRule: Rule = {
  id: "UX007",
  title: "Checkout or payment flow missing trust or recovery cues",
  category: "ux",
  severity: "high",
  run(context) {
    if (!CHECKOUT_PATTERN.test(context.source) || hasAnyKeyword(context.source, TRUST_KEYWORDS)) {
      return [];
    }

    const findings: Finding[] = [];

    traverse(context.ast, {
      Identifier(path: NodePath<t.Identifier>) {
        if (CHECKOUT_PATTERN.test(getIdentifierName(path.node))) {
          findings.push(
            createRuleFinding(
              checkoutMissingTrustRecoveryRule,
              context,
              path.node,
              "This checkout or payment flow has no obvious trust or recovery cues.",
              "Add visible security, refund, support, or payment failure recovery copy near the payment action."
            )
          );
        }
      },
      JSXText(path: NodePath<t.JSXText>) {
        if (CHECKOUT_PATTERN.test(path.node.value)) {
          findings.push(
            createRuleFinding(
              checkoutMissingTrustRecoveryRule,
              context,
              path.node,
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
