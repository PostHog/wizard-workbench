# PostHog setup report

PostHog browser analytics was installed and initialized for the React Router application, with authenticated identity handling, nine product-event call sites, route error capture, and a starter dashboard.

## Installed and initialized

- Added `posthog-js` at `^1.407.3` to `package.json` and `package-lock.json`.
- Initialized the browser singleton before hydration in `app/entry.client.tsx`, using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from the environment.
- Added the same variable names to `.env.example`; both keys were present in the local `.env` during review.
- Extended the server CSP in `app/entry.server.tsx` for PostHog script, connection, and worker requirements.
- PostHog capture defaults were retained. No runtime delivery was observed during this run.

## Events instrumented

The following nine custom events were added at browser interaction handlers. These are instrumented call sites, not confirmed deliveries; the run did not exercise the application or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_submitted` | A visitor submits an email or Google sign-in request. | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `registration_submitted` | A visitor submits an email or Google registration request. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `organization_creation_submitted` | An authenticated user submits the new organization form. | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | An authenticated user starts checkout for a selected plan interval and tier. | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_cancellation_confirmed` | An authenticated user confirms cancelling an organization subscription. | `app/features/billing/billing-page.tsx` |
| `sales_contact_submitted` | A visitor submits the enterprise sales contact form. | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `organization_invite_submitted` | An authenticated member submits an invitation with a selected role. | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `organization_deletion_confirmed` | An authenticated owner confirms organization deletion. | `app/features/organizations/settings/general/danger-zone.tsx` |
| `account_deletion_confirmed` | An authenticated user confirms account deletion. | `app/features/user-accounts/settings/account/danger-zone.tsx` |

The event properties reviewed by the capture step exclude user-entered PII. No server-side subscription completion or Stripe-webhook event was added.

## User identification

Identification was wired in `app/entry.client.tsx`. Supabase auth-state changes identify authenticated users with the stable Supabase `user.id`; email and optional display name are person properties rather than event properties. The implementation resets on sign-out, direct account switches, and logout submission. The run did not runtime-verify auth callbacks or event attribution.

## Error tracking

`app/root.tsx` now captures non-404 route errors with `posthog.captureException(error)` from the global error boundary, guarded by PostHog initialization. Expected 404 responses are excluded. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1914316) was created with five tagged insights: authentication funnel, organization creation trend, checkout starts by plan tier, subscription cancellations, and collaboration invites by role. It may remain empty until the application emits events.

## Verification and unresolved issues

- `npm install` completed successfully, and strict review found no integration remediation.
- The production build reached Vite compilation and transformed 7,602 modules, then failed on the pre-existing unresolved import `~/generated/browser` in `app/routes/_authenticated-routes+/organizations_+/_index.tsx`. This means the integration was not validated by a passing production build.
- Typecheck stopped during Prisma generation because `DATABASE_URL` was unavailable.
- Lint checked 423 files and reported 89 existing errors plus 3 warnings; no fixes were applied.
- No tests were run, and PostHog delivery was not runtime-exercised.

These unresolved project conditions cost build/typecheck/lint confidence and should be resolved independently before treating the integration as production-ready. The missing generated browser module may prevent the app from building; missing `DATABASE_URL` prevents typecheck's Prisma generation; repository lint debt obscures whether newly edited files pass lint.

## Before you merge

- [ ] Run a full production build and resolve the existing `~/generated/browser` failure in `app/routes/_authenticated-routes+/organizations_+/_index.tsx`; confirm no integration-generated build errors remain.
- [ ] Provide `DATABASE_URL` and rerun typecheck so Prisma generation and the application types are actually verified.
- [ ] Run the test suite, updating mocks or fixtures for the instrumented handlers in the nine files listed above if needed.
- [ ] Resolve or separately baseline the reported repository lint errors and warnings, then confirm the PostHog-edited files pass lint.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only `.env`; keep the exact names documented in `.env.example`.
- [ ] Load the deployed app and check the browser console for CSP violations, especially the directives changed in `app/entry.server.tsx`; a blocked SDK can queue events without sending them.
- [ ] Exercise anonymous and authenticated flows, confirm the nine named events arrive in PostHog, and verify authenticated events use the Supabase user ID after login, refresh, account switching, and logout.
- [ ] Trigger a non-404 route error and confirm the resulting exception appears in PostHog Error Tracking.
