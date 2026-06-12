import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import type { Finding, Rule, RuleContext } from "../../core/types.js";

export const EMPTY_STATE_KEYWORDS = ["empty", "no items", "no results", "no data", "nothing", "start by", "get started"];
export const LOADING_KEYWORDS = ["loading", "isloading", "pending", "ispending", "skeleton", "spinner", "aria-busy"];
export const ERROR_KEYWORDS = ["error", "alert", "failed", "failure", "try again", "unable to", "problem"];
export const SEARCH_KEYWORDS = ["search", "query", "filter"];
export const FORM_FEEDBACK_KEYWORDS = ["error", "invalid", "required", "helper", "hint", "validation", "aria-invalid", "aria-describedby"];
export const CONFIRMATION_KEYWORDS = ["confirm", "confirmation", "dialog", "modal", "undo", "are you sure"];
export const TRUST_KEYWORDS = ["secure", "security", "ssl", "encrypted", "refund", "support", "guarantee", "trusted", "card declined", "payment failed"];
export const RESPONSIVE_KEYWORDS = ["sm:", "md:", "lg:", "xl:", "max-", "min-", "flex-wrap", "grid-cols-", "overflow-x-auto", "@media"];

export function createRuleFinding(rule: Rule, context: RuleContext, node: t.Node | undefined, message: string, suggestion: string): Finding {
  return {
    ruleId: rule.id,
    title: rule.title,
    severity: rule.severity,
    filePath: context.filePath,
    line: node?.loc?.start.line,
    column: node?.loc ? node.loc.start.column + 1 : undefined,
    message,
    suggestion,
    category: rule.category
  };
}

export function hasAnyKeyword(value: string, keywords: string[]): boolean {
  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

export function getJsxElementName(node: t.JSXOpeningElement): string | undefined {
  if (t.isJSXIdentifier(node.name)) {
    return node.name.name;
  }

  if (t.isJSXMemberExpression(node.name) && t.isJSXIdentifier(node.name.property)) {
    return node.name.property.name;
  }

  return undefined;
}

export function getJsxAttribute(node: t.JSXOpeningElement, name: string): t.JSXAttribute | undefined {
  return node.attributes.find((attribute): attribute is t.JSXAttribute => {
    return t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name) && attribute.name.name === name;
  });
}

export function getJsxAttributeText(attribute: t.JSXAttribute | undefined): string {
  if (!attribute?.value) {
    return "";
  }

  if (t.isStringLiteral(attribute.value)) {
    return attribute.value.value;
  }

  if (t.isJSXExpressionContainer(attribute.value)) {
    const expression = attribute.value.expression;
    if (t.isStringLiteral(expression)) {
      return expression.value;
    }
    if (t.isTemplateLiteral(expression)) {
      return expression.quasis.map((quasi) => quasi.value.raw).join(" ");
    }
  }

  return "";
}

export function getCallName(node: t.CallExpression): string {
  if (t.isIdentifier(node.callee)) {
    return node.callee.name;
  }

  if (t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.property)) {
    return node.callee.property.name;
  }

  return "";
}

export function getIdentifierName(node: t.Node | null | undefined): string {
  if (t.isIdentifier(node)) {
    return node.name;
  }

  if (t.isJSXIdentifier(node)) {
    return node.name;
  }

  return "";
}

export function pathHasJsxAncestor(path: NodePath): boolean {
  return Boolean(path.findParent((parent) => parent.isJSXElement() || parent.isJSXFragment()));
}

export function dedupeFindings(findings: Finding[]): Finding[] {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const key = `${finding.ruleId}:${finding.filePath}:${finding.line ?? "?"}:${finding.column ?? "?"}:${finding.message}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
