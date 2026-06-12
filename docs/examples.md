# Examples

The `examples` directory contains intentionally small fixtures for trying UIQA locally.

## Basic Examples

Run:

```bash
pnpm build
pnpm uiqa scan --path ./examples --format markdown
```

The root examples include missing image alt text, hardcoded color usage, and focused bad/good UX fixtures.

## Next + Tailwind Examples

Run:

```bash
pnpm uiqa scan --path ./examples/next-tailwind/src --format markdown
```

Files ending in `Bad.tsx` intentionally trigger UIQA rules:

- `CheckoutBad.tsx`: weak checkout trust and recovery cues.
- `DashboardBad.tsx`: missing empty/loading/error states and mobile layout risk.
- `SearchBad.tsx`: search without no-result messaging.
- `FormBad.tsx`: form without validation or helper feedback.

Files ending in `Good.tsx` demonstrate preferred patterns:

- Visible loading, empty, and error states.
- No-result search recovery.
- Accessible form feedback.
- Checkout reassurance and payment recovery copy.
- Responsive Tailwind layout cues.
