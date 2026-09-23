# Feature flags: Django 3 SaaS

Runs the `wizard feature-flags` e2e against the source tree of
[`basic-integration/django/django3-saas`](../../../basic-integration/django/django3-saas),
named by `sourceApp` in `.wizard-ci/source.json`. PostHog is not installed there.

There is no code here on purpose: a copy of the app would drift from the one it
was copied from.

Expected wizard outcome, graded by `services/wizard-ci/feature-flag-checks.ts`
against the keys in `.wizard-ci/feature-flags.json`:

- creates the backend example flag, inactive at 0% rollout; the templates hold
  no scripts, so there is no frontend side and no frontend flag
- keeps the key in one constants module and evaluates it once from another file
- writes `posthog-feature-flags-report.md`
