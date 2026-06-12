# UIQA Rules

UIQA rules are deterministic static checks. They flag product experience risks that are easy to miss in pull requests.

Each finding includes a severity, category, file path, message, and suggestion. Line and column are included when Babel location data is available.

## A11Y001 Image Missing Alt Text

Images need text alternatives so assistive technology can explain meaningful visuals.

Detects:

- JSX `<img>` elements without a meaningful `alt` attribute.

Acceptable patterns:

- Use `alt="Dashboard showing checkout status"` for meaningful images.
- Use `alt=""` only when the image is decorative.

## A11Y002 Interactive Element Missing Accessible Label

Icon-only controls need an accessible name so assistive technology can describe the action.

Detects:

- Buttons and links without visible text, `aria-label`, `aria-labelledby`, or `title`.
- Elements with `role="button"` or `role="link"` that do not expose a label.

Acceptable patterns:

- Add visible text such as `Delete project`.
- Add `aria-label="Delete project"` for icon-only controls.

## DS001 Hardcoded Hex Color

Raw hex colors bypass design tokens and make visual updates harder to apply consistently.

Detects:

- Hex color literals in JSX attributes, style objects, template strings, or string literals.

Acceptable patterns:

- Use a design token, CSS variable, or shared theme value.

## DS002 Inconsistent Spacing Token Usage

Raw spacing values make product rhythm harder to maintain across screens and design-system updates.

Detects:

- Inline spacing styles such as `padding: 18` or `marginTop: "12px"`.
- Tailwind arbitrary spacing values such as `p-[18px]` or `gap-[13px]`.

Acceptable patterns:

- Use spacing tokens, theme values, or standard spacing scale classes such as `p-4`, `mt-3`, or `gap-2`.

## UX001 Missing Empty State

List, table, and grid UIs need a clear state for zero items.

Detects:

- `.map(...)` rendering without nearby empty-state cues.
- List-like elements such as `ul`, `ol`, and `table` without no-items copy.

Acceptable patterns:

- Check `items.length === 0` and render no-items copy.
- Provide onboarding, recovery, or next-step guidance for empty collections.

## UX002 Missing Loading State

Async data should not leave users staring at blank UI.

Detects:

- Fetch/query/data-loading patterns without loading, pending, skeleton, spinner, or `aria-busy` cues.

Acceptable patterns:

- Render loading copy, a skeleton, spinner, or pending state before data appears.

## UX003 Missing Error State

Failed requests and submit flows need visible recovery guidance.

Detects:

- `try/catch`, error variables, query patterns, and mutation patterns without visible error UI.

Acceptable patterns:

- Render `role="alert"`, retry copy, toast/alert components, or clear failure messages.

## UX004 Search UI Missing No-Result State

Search flows need a useful response when nothing matches.

Detects:

- Search inputs or filtered result patterns without no-result or empty-result messaging.

Acceptable patterns:

- Show no-results copy and suggest query changes, clearing filters, or broadening the search.

## UX005 Form Missing Validation Or Helper Feedback

Forms should explain errors and field expectations before or after submit.

Detects:

- Forms or submit buttons without validation, helper text, `aria-invalid`, `aria-describedby`, or visible feedback.

Acceptable patterns:

- Add field-level helper text, validation messages, or accessible invalid states.

## UX006 Destructive Action Missing Confirmation

Delete, remove, cancel, and discard actions need friction or recovery.

Detects:

- Destructive labels or handler names without confirmation, dialog/modal, confirm call, or undo pattern.

Acceptable patterns:

- Use a confirmation dialog, explicit modal, or undo flow.

## UX007 Checkout Or Payment Flow Missing Trust Or Recovery Cues

Checkout and payment flows need reassurance and recovery paths.

Detects:

- Checkout, payment, billing, card, or subscription UI without trust, security, refund, support, or failure recovery copy.

Acceptable patterns:

- Add secure payment copy, refund/support information, and payment failure recovery guidance.

## UX008 Mobile Layout Risk

Fixed and overflow-prone layouts often break on small screens.

Detects:

- Large fixed widths or `minWidth`.
- Tables without responsive overflow handling.
- Horizontal layouts without responsive or wrapping cues.

Acceptable patterns:

- Use responsive classes, wrapping, fluid widths, `overflow-x-auto`, or media queries.
