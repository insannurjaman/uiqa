import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../core/traverse.js";
import type { Finding, Rule } from "../core/types.js";

export const imageMissingAltRule: Rule = {
  id: "A11Y001",
  title: "Image missing alt text",
  category: "accessibility",
  severity: "high",
  run(context) {
    const findings: Finding[] = [];

    traverse(context.ast, {
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        const node = path.node;
        if (!t.isJSXIdentifier(node.name) || node.name.name !== "img") {
          return;
        }

        const altAttribute = node.attributes.find((attribute): attribute is t.JSXAttribute => {
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
          column: node.loc ? node.loc.start.column + 1 : undefined,
          message: "Image elements should include meaningful alt text.",
          suggestion: "Add an alt attribute that describes the image, or use alt=\"\" only for decorative images.",
          category: imageMissingAltRule.category
        });
      }
    });

    return findings;
  }
};

function hasMeaningfulAlt(attribute: t.JSXAttribute | undefined): boolean {
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
