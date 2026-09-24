# Feature flags: Django 3 SaaS

Runs the `wizard feature-flags` e2e against the source tree of
[`basic-integration/django/django3-saas`](../../../basic-integration/django/django3-saas),
named by `sourceApp` in `.wizard-ci/source.json`. PostHog is not installed there.

There is no code here on purpose: a copy of the app would drift from the one it
was copied from.

Expected wizard outcome, graded by `services/wizard-ci/feature-flag-checks.ts`
against the keys in `.wizard-ci/feature-flags.json`:

- the backend example flag exists in the project, inactive at 0% rollout; the
  templates hold no scripts, so there is no frontend side and no frontend flag
- the key appears in exactly one changed file, its constants module, and
  another changed file imports that module
- no changed file holds a `wizard-example-*` key outside that list
- `posthog-feature-flags-report.md` exists

The flag checks cannot prove this run created the flag: CI never deletes the
shared key, because parallel legs share it.
