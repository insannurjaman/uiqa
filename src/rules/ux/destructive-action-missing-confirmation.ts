import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../../core/traverse.js";
import type { Finding, Rule } from "../../core/types.js";
import { CONFIRMATION_KEYWORDS, createRuleFinding, dedupeFindings, getJsxAttribute, getJsxAttributeText, hasAnyKeyword } from "./helpers.js";

const DESTRUCTIVE_PATTERN = /\b(delete|remove|destroy|cancel|discard|archive)\b/i;

export const destructiveActionMissingConfirmationRule: Rule = {
  id: "UX006",
  title: "Destructive action missing confirmation",
  category: "ux",
  severity: "high",
  run(context) {
    if (hasAnyKeyword(context.source, CONFIRMATION_KEYWORDS)) {
      return [];
    }

    const findings: Finding[] = [];

    traverse(context.ast, {
      JSXElement(path: NodePath<t.JSXElement>) {
        const opening = path.node.openingElement;
        const label = path.node.children.map((child) => (t.isJSXText(child) ? child.value : "")).join(" ");
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
      Identifier(path: NodePath<t.Identifier>) {
        if (DESTRUCTIVE_PATTERN.test(path.node.name)) {
          findings.push(
            createRuleFinding(
              destructiveActionMissingConfirmationRule,
              context,
              path.node,
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
