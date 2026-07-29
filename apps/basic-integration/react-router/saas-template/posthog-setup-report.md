# PostHog setup report

PostHog browser analytics, authenticated-user attribution, exception autocapture, nine interaction events, and a starter dashboard were added to the React Router application.

## Installed and initialized

- Installed `posthog-js` with npm. The manifest declares `^1.407.8`, and the lockfile resolves version `1.407.8`.
- Initialized the browser singleton once in `app/entry.client.tsx:15`, using `window.ENV.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `window.ENV.VITE_PUBLIC_POSTHOG_HOST` rather than source-code secrets.
- Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `app/utils/env.server.ts` and documented the names in `.env.example`. The real values were configured locally in `.env`.
- Updated the Content-Security-Policy in `app/entry.server.tsx` to permit the configured PostHog API connection, derived PostHog asset host, and `blob:` workers.

## Events instrumented

These call sites were added and verified in the run. The run did **not** exercise the application or observe any event arrive in PostHog, so these are instrumented events, not confirmed captures.

| Event | What it measures | File |
|---|---|---|
| `organization_created` | An authenticated user submits the new organization form. | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `team_invite_sent` | An authenticated user submits an email invitation for a team member. | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `invite_link_copied` | An authenticated user copies an organization invite link. | `app/features/organizations/settings/team-members/invite-link-card.tsx` |
| `invite_link_regenerated` | An authenticated user requests regeneration of an organization invite link. | `app/features/organizations/settings/team-members/invite-link-card.tsx` |
| `invite_link_deactivated` | An authenticated user requests deactivation of an organization invite link. | `app/features/organizations/settings/team-members/invite-link-card.tsx` |
| `checkout_started` | An authenticated user submits a selected subscription plan to start checkout. | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_change_requested` | An authenticated user submits a subscription plan change request. | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `account_settings_saved` | An authenticated user submits account settings updates. | `app/features/user-accounts/settings/account/account-settings.tsx` |
| `organization_settings_saved` | An authenticated user submits organization settings updates. | `app/features/organizations/settings/general/general-organization-settings.tsx` |

## Identity and error tracking

User identification was wired, not skipped. After hydration, the authenticated layout calls `posthog.identify(user.id, { email: user.email })` at `app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx:34`; email is sent as a person property, not an event property. Logout calls `posthog.reset()` at `app/features/organizations/layout/nav-user.tsx:48`. The stable Supabase user ID is assumed to be the intended analytics identifier. No server-side PostHog SDK or server event stitching was added.

Global browser exception tracking was enabled with `capture_exceptions: true` in `app/entry.client.tsx` (the `posthog.init` configuration). The SDK is configured to autocapture unhandled errors and unhandled promise rejections. No exception was triggered and observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924750)

The dashboard contains five tagged insights covering organization/invitation activity, the organization-to-invitation funnel, billing lifecycle, invitation-link actions, and settings changes. The insights were created as empty-yet-live definitions when events had not arrived; the run did not verify incoming event data.

## Verification and unresolved issues

- `npm install` completed successfully and resolved `posthog-js` normally.
- Review verified initialization ordering, event handler reachability, identity/reset behavior, PII handling, and CSP changes.
- A production build was attempted twice and stopped on a pre-existing unresolved `~/generated/browser` import in `app/routes/_authenticated-routes+/organizations_+/_index.tsx`.
- Typecheck stopped during Prisma generation because `DATABASE_URL` was unavailable.
- Lint reported 82 repository-wide Biome errors before and after the integration review; no lint fixes were applied.
- npm install also reported unavailable Husky git metadata and pending package install-script approvals; these were unrelated to PostHog.

The unresolved build/typecheck/lint conditions mean compilation and repository verification were not established. They also mean the run cannot claim that events flow to PostHog. Server-side payment completion and contact-sales submission remain possible future instrumentation opportunities because no server SDK exists.

## Before you merge

- [ ] Provide the generated Prisma browser client and `DATABASE_URL`, then run the full production build; inspect `app/routes/_authenticated-routes+/organizations_+/_index.tsx` and fix any integration-generated errors.
- [ ] Run the typecheck and full test suite; update mocks or fixtures for the instrumented handlers in the nine event files above if needed.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`; keep the exact names documented in `.env.example`.
- [ ] Load the deployed app and check the browser console for CSP violations, especially the directives changed in `app/entry.server.tsx`; a blocked SDK can queue events silently.
- [ ] Confirm the returning authenticated-visitor path reaches `posthog.identify` in `app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx:34`, and confirm the nine named events appear in PostHog after exercising their handlers.
