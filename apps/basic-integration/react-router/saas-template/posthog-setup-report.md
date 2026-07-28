# PostHog setup report

PostHog’s browser SDK was installed, initialized behind configured environment variables, connected to authenticated user identity, instrumented across five authenticated actions, and linked to a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.407.5` with npm; the resolved dependency is recorded in `package-lock.json`.
- Initialized the browser singleton in `app/entry.client.tsx` before hydration using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- PostHog defaults remain enabled. Initialization is guarded when either public environment variable is absent; development throws a missing-configuration error, while production remains a no-op in that situation.
- Added the public variable names to `.env.example` and configured the real values in the local `.env` through wizard tooling.
- Updated the Content-Security-Policy in `app/entry.server.tsx` for PostHog `connect-src` and `script-src`, and added `worker-src` support for `self`, `blob:`, and `data:`.
- Route-level operations use guarded dynamic imports so the browser-only SDK does not enter server-rendered route graphs.

## Events instrumented

These are instrumented event definitions. The run did **not** browser-exercise the application or observe events arriving in PostHog, so delivery remains unconfirmed.

| Event name | What it measures | File |
|---|---|---|
| `onboarding_organization_submitted` | An authenticated user submits initial organization setup. | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | An authenticated user submits the form to create an additional organization. | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `organization_member_invite_submitted` | An authenticated user submits an email invitation for an organization member. | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `billing_checkout_started` | An authenticated user submits a selected subscription tier to begin checkout. The capture includes bounded billing period and selected tier properties. | `app/features/billing/create-subscription-modal-content.tsx` |
| `organization_invite_link_copied` | An authenticated user copies an organization invitation link. | `app/features/organizations/settings/team-members/invite-link-card.tsx` |

## User identification

Identification was wired. The authenticated layout uses the verified Supabase user UUID as the stable PostHog distinct ID and sends the email only as a person property. The logout form resets PostHog identity before server logout completes. No server-side PostHog SDK or server capture was added.

The run verified the authenticated route boundary, stable user ID source, and logout reset wiring by source inspection. It did not verify identity or events in a running browser session.

## Error tracking

`app/entry.client.tsx` starts PostHog exception autocapture after initialization with unhandled errors and unhandled promise rejections enabled; console-error capture is explicitly disabled. The run verified the configured SDK call and its type definitions, but did not trigger an error and observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919854)

The dashboard was created with five tagged insights: onboarding trend, organization creation trend, billing checkout starts by selected tier, member invitation activity, and an onboarding-to-organization conversion funnel. The dashboard and insights exist in PostHog, but the run did not validate event volume; they may remain empty until application events arrive.

## Build and verification status

- `npm install` completed successfully and resolved `posthog-js`.
- The build initially exposed a PostHog server-route graph issue. Seven targeted dynamic-import fixes were applied. The subsequent build no longer reported a PostHog issue, but still failed on the pre-existing unresolved `~/generated/browser` import from `app/routes/_authenticated-routes+/organizations_+/_index.tsx`.
- Typecheck failed during Prisma generation because `DATABASE_URL` was absent from the execution environment.
- Lint completed but reported 77 pre-existing errors and 3 warnings; no automated fixes were applied.
- No browser delivery test was run. Consequently, no event capture, exception delivery, CSP runtime behavior, or dashboard population is claimed as verified.

## Issues to follow up

1. **Production build remains blocked:** the unresolved generated Prisma browser import in `app/routes/_authenticated-routes+/organizations_+/_index.tsx` must be resolved. Leaving it unresolved prevents a successful production build.
2. **Typecheck environment is incomplete:** Prisma generation needs `DATABASE_URL`. Without it, typecheck cannot establish whether the complete application typechecks.
3. **Event delivery is unresolved:** the run did not establish that any of the five captures arrive in PostHog. If left unverified, the dashboard can exist while remaining empty or missing events in deployment.
4. **Runtime CSP behavior is unresolved:** the CSP was updated by source inspection, but a browser run is needed to confirm there are no blocked PostHog requests or workers. If left unchecked, the SDK may queue events without sending them.

## Before you merge

- [ ] Run a full production build and resolve the pre-existing `~/generated/browser` failure in `app/routes/_authenticated-routes+/organizations_+/_index.tsx`; also confirm no integration-generated build errors remain.
- [ ] Run the test suite and update any mocks or fixtures affected by the five instrumented handlers.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are present in `.env.example`, bootstrap configuration where applicable, and every deployment environment—not only local `.env`.
- [ ] If auth is enabled in a deployed environment, exercise a returning authenticated session and verify the authenticated layout calls `identify` so users do not fragment across anonymous IDs.
- [ ] Load the application in a browser and check the console and network panel for CSP violations or blocked PostHog requests; then trigger each listed action and confirm the corresponding events arrive in PostHog.
- [ ] Trigger an uncaught browser error and an unhandled promise rejection in a safe test environment, then confirm exception events arrive in PostHog.
