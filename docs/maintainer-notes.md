# UIQA Maintainer Notes

These notes summarize UIQA's purpose, public release state, maintainer priorities, and areas where contributors or AI-assisted maintainer workflows can help.

## Project Purpose

UIQA is an open-source UI/UX QA CLI and GitHub Action for modern frontend pull requests.

It scans TypeScript, JavaScript, JSX, and TSX implementation code to detect product experience risks that often slip through normal code review, including missing empty states, loading states, error recovery, form feedback, destructive action confirmation, checkout trust cues, mobile layout risks, hardcoded visual values, design-system drift, and basic accessibility gaps.

The goal is not to replace designers, accessibility tools, or code linters. UIQA adds a lightweight product-experience review layer inside the pull request workflow, so maintainers and contributors can catch common UX omissions before UI changes are merged.

## Open-Source Impact

Many open-source frontend projects receive UI contributions without having a dedicated product designer, QA process, or design-system reviewer available for every pull request.

Traditional tools are valuable, but they usually focus on syntax, formatting, accessibility primitives, or code quality. They often miss product-experience issues such as:

* A list view without an empty state.
* A form without visible validation feedback.
* A destructive action without confirmation.
* A search interface without a no-result state.
* A checkout or payment flow without recovery or trust cues.
* A data-heavy interface that is likely to break on mobile.

These are small omissions individually, but they affect real users and create extra review burden for maintainers.

UIQA gives open-source maintainers a practical, deterministic, and contributor-friendly way to surface those issues in CI or pull requests. It also helps contributors learn better UI patterns through clear findings and suggestions.

## Current Release

UIQA v0.1.1 is published and usable.

Current release includes:

* npm package: `@insannurjaman/uiqa@0.1.1`
* Working `uiqa` CLI binary after npm install
* GitHub Action support
* Markdown and JSON reporters
* Deterministic scanner for TypeScript, JavaScript, JSX, and TSX files
* UX rules for:

  * missing empty states
  * missing loading states
  * missing error states
  * missing search no-result states
  * missing form validation or helper feedback
  * destructive actions without confirmation
  * checkout/payment flows without trust or recovery cues
  * mobile layout risks
* Accessibility starter rules for missing image alt text and missing accessible labels
* Design-system starter rules for hardcoded hex colors and spacing token drift
* Documentation for rules, architecture, examples, and rule authoring
* Example good and bad UI patterns
* Contributor-friendly issue ideas and roadmap documentation

## Who UIQA Serves

UIQA is designed for:

* Open-source frontend maintainers who want lightweight automated UX feedback.
* Frontend teams reviewing product UI in pull requests.
* Product engineers working on dashboards, forms, search, checkout, and data-heavy interfaces.
* Design-system teams monitoring implementation drift.
* Contributors who want actionable feedback before human review.
* Small teams that ship UI quickly but do not have a dedicated design QA process.

## AI-Assisted Maintainer Workflow

AI tools can help maintain UIQA without becoming runtime dependencies.

Useful maintainer workflows include:

* Reviewing rule heuristics and reducing false positives.
* Designing clearer static-analysis patterns for real-world frontend code.
* Expanding documentation, examples, and rule authoring guides.
* Creating high-quality fixtures from realistic UI patterns.
* Drafting contributor issues with clear acceptance criteria.
* Helping triage edge cases from community feedback.
* Improving release notes, changelogs, and maintainer communication.
* Planning framework-specific rule packs for shadcn/ui, MUI, Next.js, and other frontend ecosystems.

Any future AI-assisted functionality should remain optional and clearly separated from the deterministic open-source rule engine.

## Near-Term Roadmap

The near-term roadmap focuses on making UIQA more useful for real open-source frontend projects:

* Rule configuration and severity overrides.
* SARIF output for code scanning integrations.
* GitHub Action annotations and PR summary comments.
* shadcn/ui-aware rule pack.
* MUI-aware rule pack.
* More real-world fixtures to reduce false positives.
* Better documentation for contributors writing new rules.
* Framework-specific examples for Next.js, Remix, Astro, Vue, and Svelte.
* Optional AI-assisted review adapter as a separate future layer.

## Contributor Needs

The project needs contributors who can help with:

* Real-world fixtures that expose noisy or missing rule behavior.
* Rule authoring for common UI libraries and design systems.
* Reporter formats such as SARIF and PR comments.
* Documentation examples that teach passing and failing UI patterns.
* Framework-specific examples for real frontend stacks.

## Project Status

UIQA is early but actively maintained.

Version `0.1.1` is published to npm and usable today, but the project still needs real-world feedback, more fixtures, and contributor testing before it can claim broad frontend coverage. The core should remain small, deterministic, and open-source-first so contributors can understand how rules work, improve them, and trust the output.

The goal is to build UIQA into a practical open-source review layer between product design and frontend engineering.
