# Feature flags: Next.js App Router SaaS

Runs the `wizard feature-flags` e2e against the source tree of
[`basic-integration/next-js/15-app-router-saas`](../../../basic-integration/next-js/15-app-router-saas),
named by `sourceApp` in `.wizard-ci/source.json`. PostHog is not installed there.

There is no code here on purpose: a copy of the app would drift from the one it
was copied from.

Expected wizard outcome, graded by `services/wizard-ci/feature-flag-checks.ts`
against the keys in `.wizard-ci/feature-flags.json`:

- both example flags exist in the project, inactive at 0% rollout
- each key appears in exactly one changed file, its constants module, and
  another changed file imports that module
- no changed file holds a `wizard-example-*` key outside that list
- `posthog-feature-flags-report.md` exists

The flag checks cannot prove this run created the flags: CI never deletes the
shared keys, because parallel legs share them.
