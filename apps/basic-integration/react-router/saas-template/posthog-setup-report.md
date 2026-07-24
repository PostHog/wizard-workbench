# PostHog setup report

PostHog was added to the React Router client with environment-based initialization, authenticated-user identity, nine product events, global React error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `1.407.2` and `@posthog/react` `1.10.3` with npm; the manifest and lockfile were updated.
- `app/lib/posthog.client.ts` is the single browser initialization module. It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, initializes once before hydration with SDK defaults, and exports the shared client.
- Missing configuration fails loudly in development and becomes a production no-op, rather than silently disabling development instrumentation.
- The keys are documented in `.env.example` and were configured in the local `.env`. The server-generated CSP allows the configured PostHog host in `connect-src` (`app/entry.server.tsx:110`).

## Events instrumented

These are code contracts found in `.posthog-wizard-cache/.posthog-events.json`. The run verified that the event names occur at the intended handlers; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `organization_creation_submitted` | User submits the organization-creation form. | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `organization_invite_submitted` | User submits an email invitation to a workspace member. | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `invite_link_copied` | User copies an organization invite link. | `app/features/organizations/settings/team-members/invite-link-card.tsx` |
| `subscription_checkout_started` | User selects a subscription tier and billing interval to start checkout. | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_change_requested` | User requests a subscription tier change, including target tier, interval, and upgrade/downgrade direction. | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `subscription_cancellation_requested` | User requests cancellation of the organization subscription. | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `user_account_update_submitted` | User submits account profile changes without recording profile values. | `app/features/user-accounts/settings/account/account-settings.tsx` |
| `onboarding_organization_submitted` | User submits the organization onboarding step without recording form content. | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `onboarding_user_account_submitted` | User submits the user-account onboarding step without recording profile values. | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |

Capture properties were reviewed as non-PII: subscription events use plan, interval, and change metadata; form events do not include submitted values. No capture call supplies a raw email, name, or explicit `distinct_id`.

## Identity

Identification **was wired**. The authenticated route layout calls `posthog.identify(loaderData.user.id, { email })` once for each loaded stable Supabase user identity (`app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx:32`). Email is a person property, not an event property. Logout resets the PostHog identity before the logout request (`app/features/organizations/layout/nav-user.tsx:122`). The run did not verify this behavior in a live browser session.

## Error tracking

`app/entry.client.tsx` wraps the hydrated router with `PostHogProvider` and `PostHogErrorBoundary`. The SDK boundary captures uncaught React rendering errors. Route loader/action errors remain outside this boundary and were not separately instrumented.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902695) was created with four insights covering onboarding submissions, organization engagement, subscription activity, and account updates/collaboration. The dashboard exists in PostHog; the run did not observe populated event data, so initial charts may be empty until users trigger the actions.

## Verification and unresolved issues

- Dependency installation and `npm install` succeeded.
- Source review found one shared browser client, environment-sourced host/token, default capture settings, stable authenticated identification, logout reset, and the nine planned snake_case capture calls.
- `npm run build` did **not** complete. It transformed 7,500 modules, then failed on the pre-existing unresolved import `~/generated/browser` from the untouched file `app/routes/_authenticated-routes+/organizations_+/_index.tsx`. The review identified this as unrelated to the PostHog changes and assumed the generated module normally comes from the project's Prisma generation workflow.
- Because the build stopped at that prerequisite, `typecheck` and `lint` were not run.
- The dashboard's first account-comparison insight request used a malformed third series and failed; a corrected replacement was created successfully. This did not prevent the dashboard from being created.
- No live event delivery was verified. Stripe webhook/payment-success tracking was not added because this run installed and configured only the browser SDK.

## Next steps

1. Generate or restore `~/generated/browser`, then run the full production build, typecheck, lint, and tests.
2. Configure `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`.
3. Load the app with CSP enabled and check the browser console/network activity for blocked PostHog requests.
4. Exercise each instrumented action as an authenticated user and confirm the nine named events arrive in PostHog with the expected non-PII properties and identified user.
5. If payment success must be measured, add and verify separate server-side Stripe/webhook instrumentation.

## Before you merge

- [ ] Restore/generate `~/generated/browser` referenced by `app/routes/_authenticated-routes+/organizations_+/_index.tsx`, then run a full production build and fix any resulting errors.
- [ ] Run the project's typecheck and lint commands after the generated module is available; neither ran in this verification.
- [ ] Run the test suite and update mocks or fixtures for the nine capture call sites listed in `.posthog-wizard-cache/.posthog-events.json` if needed.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in each deployment environment, matching the names documented in `.env.example` and used in `app/lib/posthog.client.ts`.
- [ ] Load the deployed app and check the console/network for CSP violations related to `app/entry.server.tsx:110`; a blocked SDK can queue events without sending them.
- [ ] Exercise an authenticated returning-visitor path and confirm `app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx:32` identifies the stable user rather than leaving activity anonymous.
- [ ] Confirm each instrumented action produces its expected event in PostHog; the run verified code placement only, not event arrival.
