import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../../core/traverse.js";
import type { Finding, Rule } from "../../core/types.js";
import { FORM_FEEDBACK_KEYWORDS, createRuleFinding, dedupeFindings, getJsxAttribute, getJsxAttributeText, getJsxElementName, hasAnyKeyword } from "./helpers.js";

export const formMissingFeedbackRule: Rule = {
  id: "UX005",
  title: "Form missing validation or helper feedback",
  category: "ux",
  severity: "medium",
  run(context) {
    if (hasAnyKeyword(context.source, FORM_FEEDBACK_KEYWORDS)) {
      return [];
    }

    const findings: Finding[] = [];

    traverse(context.ast, {
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        const name = getJsxElementName(path.node);
        const type = getJsxAttributeText(getJsxAttribute(path.node, "type")).toLowerCase();
        if (name === "form" || (name === "button" && type === "submit")) {
          findings.push(
            createRuleFinding(
              formMissingFeedbackRule,
              context,
              path.node,
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
