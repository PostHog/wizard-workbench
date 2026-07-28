# PostHog setup report

PostHog product analytics, authenticated-user identification, React error tracking, event capture, and a starter dashboard were added to the React Router application.

## Installed and initialized

- Installed `posthog-js` and `@posthog/react` with npm; `package.json` and `package-lock.json` were updated.
- Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the local environment through the wizard, and documented both names in `.env.example`.
- Exposed the optional public values through `window.ENV` in `app/utils/env.server.ts`.
- Added one guarded browser initialization in `app/entry.client.tsx` using the shared `posthog-js` singleton, configured with `api_host` and `defaults: "2026-01-30"`. Missing configuration is a development error and a production no-op.
- No server-side PostHog SDK was added.

## Events instrumented

These seven capture calls were found and recorded in `.posthog-wizard-cache/.posthog-events.json`:

| Event | What it measures | File |
|---|---|---|
| `onboarding_user_account_submitted` | An authenticated user submits profile setup during onboarding. | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_submitted` | An authenticated user submits organization setup during onboarding. | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_creation_submitted` | An authenticated user submits a new organization request. | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `paste_creation_submitted` | An authenticated organization member submits a new paste. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `team_member_invite_submitted` | An authenticated organization member submits an email invitation. | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `subscription_checkout_started` | An authenticated organization member selects a subscription tier and billing interval for checkout. | `app/features/billing/create-subscription-modal-content.tsx` |
| `contact_sales_requested` | A visitor or authenticated user submits the sales contact form. | `app/features/billing/contact-sales/contact-sales-team.tsx` |

The run verified that all seven planned capture calls exist in source and that their event plan was recorded. It did **not** observe events arriving in PostHog, so event delivery and current data volume remain unconfirmed. Form events represent deliberate submits, including validation failures; confirmed-success semantics were not established.

Stripe webhook and confirmed billing-completion events remain uninstrumented because no server SDK or request-scoped server identity was configured.

## User identification

Identification was wired for authenticated browser users in `app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx`, using the stable Supabase user UUID. Email is sent as a person property rather than an event property. `app/features/organizations/layout/nav-user.tsx` resets PostHog before logout so a later browser user starts anonymously. The run verified the auth middleware provides the UUID and that the protected route is the shared boundary, but it did not execute a browser session to confirm identify or reset calls in production.

The public sales form intentionally supports anonymous visitors and therefore has no required authenticated identity.

## Error tracking

`app/entry.client.tsx` now wraps the application in `PostHogProvider` and `PostHogErrorBoundary` from `@posthog/react`. The global client-side React error boundary is configured; no manual exception calls or per-route wrappers were added. The review also retained the global boundary while disabling console-error ingestion.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918340) contains four wizard-tagged insights covering onboarding completion, organization/paste activity, invitations/sales interest, and subscription checkout starts by tier. Dashboard and insight creation succeeded, but the dashboard may currently be empty because event arrival was not observed during this run.

## Verification and unresolved build conflict

- `npm install` completed successfully.
- The integration review found the changes minimal and consistent with the reference shape; CSP was updated in `app/entry.server.tsx` for the configured PostHog API host, derived assets host, and `blob:` workers.
- The production build was run twice and failed before integration validation because the pre-existing organizations index route cannot resolve the generated Prisma browser client at `~/generated/browser`.
- Typecheck failed during pre-existing Prisma generation because `DATABASE_URL` is unavailable.
- Lint ran twice and reported broad repository errors (85 initially, 84 after npm normalized package metadata), not PostHog-source errors.
- npm reported pending package install scripts and 74 dependency audit vulnerabilities; these were not changed by this run.

These are unresolved setup issues, not evidence that the PostHog integration itself fails. The review could not prove a clean build, typecheck, or lint result.

## Before you merge

- [ ] Run a full production build and fix any integration-generated errors; first resolve the pre-existing generated Prisma browser client failure at the organizations index route importing `~/generated/browser`.
- [ ] Provide `DATABASE_URL` and rerun typecheck; inspect the Prisma generation failure before merging (`DATABASE_URL` configuration and generated browser client setup).
- [ ] Run the test suite and update mocks or fixtures for the seven instrumented submit handlers in the files listed above.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deploy environment, matching the names documented in `.env.example` and the exposure in `app/utils/env.server.ts`.
- [ ] Load the deployed app and check the browser console for CSP violations affecting `app/entry.server.tsx`; a blocked SDK can queue events without sending them.
- [ ] In an authenticated browser session, verify the returning-user path identifies the Supabase UUID in `app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx` and logout resets identity in `app/features/organizations/layout/nav-user.tsx`.
- [ ] Trigger representative forms and confirm the seven planned events arrive in PostHog; success-only tracking may require moving captures from submit handlers to confirmed action results.
