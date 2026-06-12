# UIQA Report

Score: 0/100
Scanned files: 21
Findings: 32

Severity: 10 high, 22 medium, 0 low

## Categories

- ux: 23
- design-system: 6
- accessibility: 3

## Findings By Severity

### High (10)

#### A11Y001: Image missing alt text

- Category: accessibility
- Location: examples/App.tsx:5:7
- Message: Image elements should include meaningful alt text.
- Suggestion: Add an alt attribute that describes the image, or use alt="" only for decorative images.

#### UX007: Checkout or payment flow missing trust or recovery cues

- Category: ux
- Location: examples/App.tsx:4:40
- Message: This checkout or payment UI has no obvious trust or recovery cues.
- Suggestion: Add reassurance such as secure payment copy, support contact, refund policy, or failed-payment recovery guidance.

#### A11Y002: Interactive element missing accessible label

- Category: accessibility
- Location: examples/bad/AccessibleLabel.tsx:3:5
- Message: Interactive elements need an accessible name so assistive technology can describe the action.
- Suggestion: Add visible text, aria-label, aria-labelledby, or a title that clearly names the action.

#### UX007: Checkout or payment flow missing trust or recovery cues

- Category: ux
- Location: examples/bad/CheckoutTrust.tsx:1:17
- Message: This checkout or payment flow has no obvious trust or recovery cues.
- Suggestion: Add visible security, refund, support, or payment failure recovery copy near the payment action.

#### UX006: Destructive action missing confirmation

- Category: ux
- Location: examples/bad/DestructiveAction.tsx:2:10
- Message: This destructive action has no obvious confirmation or undo pattern.
- Suggestion: Require confirmation, show a dialog, or provide an undo path before completing destructive actions.

#### UX003: Missing error state

- Category: ux
- Location: examples/bad/MissingErrorState.tsx:4:5
- Message: This error path has no obvious user-facing error state.
- Suggestion: Show a visible error message with recovery guidance instead of only logging or swallowing the error.

#### UX003: Missing error state

- Category: ux
- Location: examples/bad/MissingLoadingState.tsx:2:20
- Message: This query or mutation pattern has no visible error handling.
- Suggestion: Render an error, retry, or recovery state when the request fails.

#### UX007: Checkout or payment flow missing trust or recovery cues

- Category: ux
- Location: examples/next-tailwind/src/CheckoutBad.tsx:4:46
- Message: This checkout or payment UI has no obvious trust or recovery cues.
- Suggestion: Add reassurance such as secure payment copy, support contact, refund policy, or failed-payment recovery guidance.

#### A11Y002: Interactive element missing accessible label

- Category: accessibility
- Location: examples/next-tailwind/src/DashboardBad.tsx:24:7
- Message: Interactive elements need an accessible name so assistive technology can describe the action.
- Suggestion: Add visible text, aria-label, aria-labelledby, or a title that clearly names the action.

#### UX003: Missing error state

- Category: ux
- Location: examples/next-tailwind/src/DashboardBad.tsx:2:20
- Message: This query or mutation pattern has no visible error handling.
- Suggestion: Render an error, retry, or recovery state when the request fails.

### Medium (22)

#### DS001: Hardcoded hex color

- Category: design-system
- Location: examples/App.tsx:4:27
- Message: Hardcoded hex colors make design-system updates harder to apply consistently.
- Suggestion: Use a design token, CSS variable, or shared theme value instead of a raw hex color.

#### DS001: Hardcoded hex color

- Category: design-system
- Location: examples/Button.jsx:2:44
- Message: Hardcoded hex colors make design-system updates harder to apply consistently.
- Suggestion: Use a design token, CSS variable, or shared theme value instead of a raw hex color.

#### UX005: Form missing validation or helper feedback

- Category: ux
- Location: examples/bad/FormFeedback.tsx:3:5
- Message: This form can be submitted without obvious validation or helper feedback.
- Suggestion: Add field-level validation, helper text, aria-invalid, or a visible form error message.

#### UX001: Missing empty state

- Category: ux
- Location: examples/bad/MissingEmptyState.tsx:2:10
- Message: This list-like UI has no obvious empty state copy.
- Suggestion: Show what happens when the collection is empty and guide the user toward the next useful action.

#### UX001: Missing empty state

- Category: ux
- Location: examples/bad/MissingLoadingState.tsx:3:20
- Message: This list renders mapped data without an obvious empty state.
- Suggestion: Add a fallback for zero items, such as a no-results message, onboarding prompt, or recovery action.

#### UX002: Missing loading state

- Category: ux
- Location: examples/bad/MissingLoadingState.tsx:2:20
- Message: This component appears to load data but has no visible loading state.
- Suggestion: Render a loading, skeleton, spinner, or pending state while data is unavailable.

#### UX001: Missing empty state

- Category: ux
- Location: examples/bad/MobileLayout.tsx:4:7
- Message: This list-like UI has no obvious empty state copy.
- Suggestion: Show what happens when the collection is empty and guide the user toward the next useful action.

#### UX008: Mobile layout risk

- Category: ux
- Location: examples/bad/MobileLayout.tsx:3:19
- Message: This layout uses a fixed width that may not fit mobile screens.
- Suggestion: Prefer fluid sizing with max-width constraints or responsive breakpoints.

#### UX001: Missing empty state

- Category: ux
- Location: examples/bad/SearchNoResults.tsx:6:8
- Message: This list renders mapped data without an obvious empty state.
- Suggestion: Add a fallback for zero items, such as a no-results message, onboarding prompt, or recovery action.

#### UX004: Search UI missing no-result state

- Category: ux
- Location: examples/bad/SearchNoResults.tsx:2:29
- Message: Filtered results are rendered without a no-result fallback.
- Suggestion: Add copy for searches that return zero matches and suggest how to recover.

#### DS002: Inconsistent spacing token usage

- Category: design-system
- Location: examples/bad/SpacingTokens.tsx:2:28
- Message: Raw spacing values make layout rhythm harder to keep consistent across the product.
- Suggestion: Use a design-system spacing token, scale class, or shared theme value instead of ad hoc pixel spacing.

#### DS002: Inconsistent spacing token usage

- Category: design-system
- Location: examples/next-tailwind/src/CheckoutBad.tsx:3:21
- Message: Raw spacing values make layout rhythm harder to keep consistent across the product.
- Suggestion: Use a design-system spacing token, scale class, or shared theme value instead of ad hoc pixel spacing.

#### UX008: Mobile layout risk

- Category: ux
- Location: examples/next-tailwind/src/CheckoutBad.tsx:3:5
- Message: This layout uses fixed or horizontal sizing without obvious responsive behavior.
- Suggestion: Use responsive classes, wrapping, flexible widths, or mobile-specific layout adjustments.

#### DS002: Inconsistent spacing token usage

- Category: design-system
- Location: examples/next-tailwind/src/DashboardBad.tsx:5:21
- Message: Raw spacing values make layout rhythm harder to keep consistent across the product.
- Suggestion: Use a design-system spacing token, scale class, or shared theme value instead of ad hoc pixel spacing.

#### UX001: Missing empty state

- Category: ux
- Location: examples/next-tailwind/src/DashboardBad.tsx:7:10
- Message: This list renders mapped data without an obvious empty state.
- Suggestion: Add a fallback for zero items, such as a no-results message, onboarding prompt, or recovery action.

#### UX002: Missing loading state

- Category: ux
- Location: examples/next-tailwind/src/DashboardBad.tsx:2:20
- Message: This component appears to load data but has no visible loading state.
- Suggestion: Render a loading, skeleton, spinner, or pending state while data is unavailable.

#### UX008: Mobile layout risk

- Category: ux
- Location: examples/next-tailwind/src/DashboardBad.tsx:14:7
- Message: This table may overflow on small screens.
- Suggestion: Wrap wide tables in horizontal scrolling or provide a responsive mobile layout.

#### DS002: Inconsistent spacing token usage

- Category: design-system
- Location: examples/next-tailwind/src/FormBad.tsx:3:21
- Message: Raw spacing values make layout rhythm harder to keep consistent across the product.
- Suggestion: Use a design-system spacing token, scale class, or shared theme value instead of ad hoc pixel spacing.

#### UX005: Form missing validation or helper feedback

- Category: ux
- Location: examples/next-tailwind/src/FormBad.tsx:3:5
- Message: This form can be submitted without obvious validation or helper feedback.
- Suggestion: Add field-level validation, helper text, aria-invalid, or a visible form error message.

#### UX008: Mobile layout risk

- Category: ux
- Location: examples/next-tailwind/src/FormBad.tsx:3:5
- Message: This layout uses fixed or horizontal sizing without obvious responsive behavior.
- Suggestion: Use responsive classes, wrapping, flexible widths, or mobile-specific layout adjustments.

#### UX001: Missing empty state

- Category: ux
- Location: examples/next-tailwind/src/SearchBad.tsx:8:10
- Message: This list renders mapped data without an obvious empty state.
- Suggestion: Add a fallback for zero items, such as a no-results message, onboarding prompt, or recovery action.

#### UX004: Search UI missing no-result state

- Category: ux
- Location: examples/next-tailwind/src/SearchBad.tsx:2:29
- Message: Filtered results are rendered without a no-result fallback.
- Suggestion: Add copy for searches that return zero matches and suggest how to recover.

## Next Steps

- Start with high severity findings before merging user-facing flows.
- Add missing state, recovery, confirmation, or responsive behavior where the report flags UX risk.
- Fix accessibility findings so core UI remains understandable to assistive technology.
- Replace hardcoded visual values with shared design tokens or theme values.
