# Feature flags: Next.js App Router SaaS

Runs the `wizard feature-flags` e2e against the source tree of
[`basic-integration/next-js/15-app-router-saas`](../../../basic-integration/next-js/15-app-router-saas),
named by `sourceApp` in `.wizard-ci/source.json`. PostHog is not installed there.

There is no code here on purpose: a copy of the app would drift from the one it
was copied from.

Expected wizard outcome, graded by `services/wizard-ci/feature-flag-checks.ts`
against the keys in `.wizard-ci/feature-flags.json`:

- creates both example flags, inactive at 0% rollout
- keeps both keys in one constants module and evaluates each once, on its own
  side, from another file
- writes `posthog-feature-flags-report.md`
