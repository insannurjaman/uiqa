import type { Rule } from "../../core/types.js";
import { checkoutMissingTrustRecoveryRule } from "./checkout-missing-trust-recovery.js";
import { destructiveActionMissingConfirmationRule } from "./destructive-action-missing-confirmation.js";
import { formMissingFeedbackRule } from "./form-missing-feedback.js";
import { missingEmptyStateRule } from "./missing-empty-state.js";
import { missingErrorStateRule } from "./missing-error-state.js";
import { missingLoadingStateRule } from "./missing-loading-state.js";
import { mobileLayoutRiskRule } from "./mobile-layout-risk.js";
import { searchMissingNoResultStateRule } from "./search-missing-no-result-state.js";

export const uxRules: Rule[] = [
  missingEmptyStateRule,
  missingLoadingStateRule,
  missingErrorStateRule,
  searchMissingNoResultStateRule,
  formMissingFeedbackRule,
  destructiveActionMissingConfirmationRule,
  checkoutMissingTrustRecoveryRule,
  mobileLayoutRiskRule
];

export {
  checkoutMissingTrustRecoveryRule,
  destructiveActionMissingConfirmationRule,
  formMissingFeedbackRule,
  missingEmptyStateRule,
  missingErrorStateRule,
  missingLoadingStateRule,
  mobileLayoutRiskRule,
  searchMissingNoResultStateRule
};
