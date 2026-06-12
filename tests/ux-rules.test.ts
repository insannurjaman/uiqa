import { describe, expect, it } from "vitest";
import {
  checkoutMissingTrustRecoveryRule,
  destructiveActionMissingConfirmationRule,
  formMissingFeedbackRule,
  missingEmptyStateRule,
  missingErrorStateRule,
  missingLoadingStateRule,
  mobileLayoutRiskRule,
  searchMissingNoResultStateRule
} from "../src/rules/ux/index.js";
import { createRuleContext } from "./helpers.js";

describe("UX001 missing empty state", () => {
  it("reports mapped collections without an empty state", () => {
    const context = createRuleContext("Orders.tsx", "export const Orders = ({ orders }) => <ul>{orders.map(order => <li>{order.name}</li>)}</ul>;");

    expect(missingEmptyStateRule.run(context)[0]).toMatchObject({ ruleId: "UX001", severity: "medium", category: "ux" });
  });

  it("allows mapped collections with empty state copy", () => {
    const context = createRuleContext(
      "Orders.tsx",
      "export const Orders = ({ orders }) => orders.length === 0 ? <p>No items yet</p> : <ul>{orders.map(order => <li>{order.name}</li>)}</ul>;"
    );

    expect(missingEmptyStateRule.run(context)).toHaveLength(0);
  });
});

describe("UX002 missing loading state", () => {
  it("reports data fetching without loading UI", () => {
    const context = createRuleContext("Products.tsx", "export const Products = () => { const { data } = useQuery(); return <div>{data.name}</div>; };");

    expect(missingLoadingStateRule.run(context)[0]).toMatchObject({ ruleId: "UX002", severity: "medium", category: "ux" });
  });

  it("allows data fetching with loading UI", () => {
    const context = createRuleContext(
      "Products.tsx",
      "export const Products = () => { const { data, isLoading } = useQuery(); if (isLoading) return <p>Loading products</p>; return <div>{data.name}</div>; };"
    );

    expect(missingLoadingStateRule.run(context)).toHaveLength(0);
  });
});

describe("UX003 missing error state", () => {
  it("reports caught errors without visible recovery", () => {
    const context = createRuleContext(
      "Submit.tsx",
      "export async function submit() { try { await saveOrder(); } catch (error) { console.error(error); } return <button>Save</button>; }"
    );

    expect(missingErrorStateRule.run(context)[0]).toMatchObject({ ruleId: "UX003", severity: "high", category: "ux" });
  });

  it("allows visible error recovery", () => {
    const context = createRuleContext(
      "Submit.tsx",
      "export function Submit({ error }) { return error ? <p role=\"alert\">Unable to save. Try again.</p> : <button>Save</button>; }"
    );

    expect(missingErrorStateRule.run(context)).toHaveLength(0);
  });
});

describe("UX004 search missing no-result state", () => {
  it("reports search controls without no-result messaging", () => {
    const context = createRuleContext("Search.tsx", "export const Search = ({ items }) => <><input type=\"search\" />{items.filter(Boolean).map(item => <p>{item}</p>)}</>;");

    expect(searchMissingNoResultStateRule.run(context)[0]).toMatchObject({ ruleId: "UX004", severity: "medium", category: "ux" });
  });

  it("allows search controls with no-result messaging", () => {
    const context = createRuleContext(
      "Search.tsx",
      "export const Search = ({ results }) => <><input type=\"search\" />{results.length === 0 ? <p>No results</p> : results.map(result => <p>{result}</p>)}</>;"
    );

    expect(searchMissingNoResultStateRule.run(context)).toHaveLength(0);
  });
});

describe("UX005 form missing validation or helper feedback", () => {
  it("reports submit forms without feedback", () => {
    const context = createRuleContext("Login.tsx", "export const Login = () => <form><input name=\"email\" /><button type=\"submit\">Sign in</button></form>;");

    expect(formMissingFeedbackRule.run(context)[0]).toMatchObject({ ruleId: "UX005", severity: "medium", category: "ux" });
  });

  it("allows forms with field feedback", () => {
    const context = createRuleContext(
      "Login.tsx",
      "export const Login = ({ emailError }) => <form><input aria-invalid={Boolean(emailError)} aria-describedby=\"email-help\" /><p id=\"email-help\">Enter a valid email.</p><button type=\"submit\">Sign in</button></form>;"
    );

    expect(formMissingFeedbackRule.run(context)).toHaveLength(0);
  });
});

describe("UX006 destructive action missing confirmation", () => {
  it("reports destructive actions without confirmation", () => {
    const context = createRuleContext("DeleteButton.tsx", "export const DeleteButton = () => <button onClick={deleteProject}>Delete project</button>;");

    expect(destructiveActionMissingConfirmationRule.run(context)[0]).toMatchObject({ ruleId: "UX006", severity: "high", category: "ux" });
  });

  it("allows destructive actions with confirmation", () => {
    const context = createRuleContext(
      "DeleteButton.tsx",
      "export const DeleteButton = () => <button onClick={() => window.confirm('Are you sure?') && deleteProject()}>Delete project</button>;"
    );

    expect(destructiveActionMissingConfirmationRule.run(context)).toHaveLength(0);
  });
});

describe("UX007 checkout missing trust or recovery cues", () => {
  it("reports checkout flows without trust cues", () => {
    const context = createRuleContext("Checkout.tsx", "export const Checkout = () => <section><h1>Checkout</h1><button>Pay now</button></section>;");

    expect(checkoutMissingTrustRecoveryRule.run(context)[0]).toMatchObject({ ruleId: "UX007", severity: "high", category: "ux" });
  });

  it("allows checkout flows with trust and support cues", () => {
    const context = createRuleContext(
      "Checkout.tsx",
      "export const Checkout = () => <section><h1>Checkout</h1><p>Secure encrypted payment. Contact support if payment failed.</p><button>Pay now</button></section>;"
    );

    expect(checkoutMissingTrustRecoveryRule.run(context)).toHaveLength(0);
  });
});

describe("UX008 mobile layout risk", () => {
  it("reports fixed widths that may overflow mobile screens", () => {
    const context = createRuleContext("Table.tsx", "export const Table = () => <div style={{ width: 720 }}><table><tbody /></table></div>;");

    expect(mobileLayoutRiskRule.run(context)[0]).toMatchObject({ ruleId: "UX008", severity: "medium", category: "ux" });
  });

  it("allows responsive layout cues", () => {
    const context = createRuleContext("Table.tsx", "export const Table = () => <div className=\"overflow-x-auto md:flex-row flex-wrap\"><table><tbody /></table></div>;");

    expect(mobileLayoutRiskRule.run(context)).toHaveLength(0);
  });
});
