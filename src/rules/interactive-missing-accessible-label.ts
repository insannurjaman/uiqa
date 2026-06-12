import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../core/traverse.js";
import type { Finding, Rule } from "../core/types.js";

const INTERACTIVE_ELEMENTS = new Set(["button", "a"]);
const LABEL_PROPS = new Set(["aria-label", "aria-labelledby", "title"]);

export const interactiveMissingAccessibleLabelRule: Rule = {
  id: "A11Y002",
  title: "Interactive element missing accessible label",
  category: "accessibility",
  severity: "high",
  run(context) {
    const findings: Finding[] = [];

    traverse(context.ast, {
      JSXElement(path: NodePath<t.JSXElement>) {
        const opening = path.node.openingElement;
        const name = getElementName(opening);
        if (!name || !isInteractiveElement(name, opening)) {
          return;
        }

        if (hasAccessibleLabel(path.node)) {
          return;
        }

        findings.push({
          ruleId: interactiveMissingAccessibleLabelRule.id,
          title: interactiveMissingAccessibleLabelRule.title,
          severity: interactiveMissingAccessibleLabelRule.severity,
          filePath: context.filePath,
          line: opening.loc?.start.line,
          column: opening.loc ? opening.loc.start.column + 1 : undefined,
          message: "Interactive elements need an accessible name so assistive technology can describe the action.",
          suggestion: "Add visible text, aria-label, aria-labelledby, or a title that clearly names the action.",
          category: interactiveMissingAccessibleLabelRule.category
        });
      }
    });

    return findings;
  }
};

function isInteractiveElement(name: string, opening: t.JSXOpeningElement): boolean {
  if (INTERACTIVE_ELEMENTS.has(name)) {
    return true;
  }

  const role = getAttributeText(opening, "role");
  return role === "button" || role === "link";
}

function hasAccessibleLabel(node: t.JSXElement): boolean {
  if (node.openingElement.attributes.some((attribute) => t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name) && LABEL_PROPS.has(attribute.name.name))) {
    return true;
  }

  return node.children.some((child) => {
    if (t.isJSXText(child)) {
      return child.value.trim().length > 0;
    }

    if (t.isJSXExpressionContainer(child)) {
      return !t.isJSXEmptyExpression(child.expression) && !isIconOnlyExpression(child.expression);
    }

    if (t.isJSXElement(child)) {
      const childName = getElementName(child.openingElement);
      if (childName && /icon$/i.test(childName)) {
        return false;
      }
      return hasAccessibleLabel(child);
    }

    return false;
  });
}

function isIconOnlyExpression(expression: t.Expression | t.JSXEmptyExpression): boolean {
  return t.isIdentifier(expression) && /icon$/i.test(expression.name);
}

function getElementName(opening: t.JSXOpeningElement): string | undefined {
  if (t.isJSXIdentifier(opening.name)) {
    return opening.name.name;
  }
  if (t.isJSXMemberExpression(opening.name) && t.isJSXIdentifier(opening.name.property)) {
    return opening.name.property.name;
  }
  return undefined;
}

function getAttributeText(opening: t.JSXOpeningElement, name: string): string {
  const attribute = opening.attributes.find((attr): attr is t.JSXAttribute => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === name);
  if (!attribute?.value || !t.isStringLiteral(attribute.value)) {
    return "";
  }
  return attribute.value.value;
}
