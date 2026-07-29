# PostHog setup report

PostHog browser analytics was installed, initialized from environment variables, connected to authenticated Supabase identity, instrumented across six product actions, and added to a starter dashboard.

## Installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` are synchronized, resolving `posthog-js@1.408.0`.
- Initialized one browser client in `app/lib/posthog.client.ts`, imported once from `app/entry.client.tsx`.
- Configuration uses `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`; both keys are documented in `.env.example` and were configured locally in `.env`.
- Missing configuration is loud in development and a production no-op, so absent environment values do not break production boot.
- No server-side PostHog SDK was added; server-side definitive outcomes remain outside this integration.

## Events instrumented

The run recorded these six browser capture contracts. No runtime event delivery was observed, so these are instrumented events, not confirmed-ingested events.

| Event | What it measures | File |
|---|---|---|
| `signup_started` | Visitor starts registration from the landing call to action. | `app/features/landing/cta.tsx` |
| `organization_created` | Authenticated user submits the organization creation form. | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `team_invite_submitted` | Team member invitation is submitted, segmented by selected role. | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `invite_link_copied` | An organization invite link is copied to the clipboard. | `app/features/organizations/settings/team-members/invite-link-card.tsx` |
| `checkout_started` | An organization starts checkout for a selected subscription tier and billing interval. | `app/features/billing/create-subscription-modal-content.tsx` |
| `paste_created` | Authenticated user submits a new paste, segmented by visibility choice. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |

Captures are placed in browser event handlers, use non-PII properties, and rely on root-level identity rather than per-event IDs. Server-side checkout completion, cancellation, deletion, and successful contact-sales outcomes were intentionally not instrumented.

## Identification

Identification is wired in `app/root.tsx` using the stable Supabase `user.id`. The root lifecycle identifies authenticated users with optional email/name person properties, identifies returning authenticated sessions, resets on logout, and resets before switching directly between accounts. No per-event `distinct_id` placeholder was recorded.

## Error tracking

The root React Router `ErrorBoundary` in `app/root.tsx` calls the initialized browser client's `captureException`, converting non-Error route responses into descriptive errors while preserving existing 404 and fallback rendering. Server-side errors remain unmodified.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926649) was created with four wizard-tagged insight tiles: signup funnel, core activation trends, checkout starts by tier, and team collaboration signals. The dashboard exists, but its data may be empty until the app emits events; the run did not observe event ingestion.

## Verification and unresolved issues

The review found the integration changes minimal, aligned with codebase patterns, and free of unused helpers or unrelated edits. `npm install` completed successfully and the lockfile resolves the SDK.

The run did **not** verify live event flow, production deployment behavior, or the test suite. Build, typecheck, and lint verification are blocked by pre-existing project/environment defects:

- `npm run build` transformed 7,500 modules but failed on the unresolved pre-existing `~/generated/browser` import in `app/routes/_authenticated-routes+/_index.tsx`.
- `npm run typecheck` failed during Prisma generation because `DATABASE_URL` was missing.
- `npm run lint` reported 77 project-wide Biome errors and 3 warnings, including `package.json`; no automated fixes were applied.
- No tests were run.

If these issues remain unresolved, the project cannot complete its normal build/typecheck/lint verification, and live analytics delivery remains unconfirmed.

## Before you merge

- [ ] Run a full production build and fix any errors introduced by the integration; first inspect the unresolved `~/generated/browser` import in `app/routes/_authenticated-routes+/_index.tsx`.
- [ ] Configure `DATABASE_URL`, then run typecheck and distinguish Prisma/environment failures from any integration errors.
- [ ] Run the test suite and update mocks or fixtures for the instrumented handlers if needed.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are set in every deploy environment, not only `.env`; the exact names are documented in `.env.example`.
- [ ] Exercise each instrumented browser action in a real non-bot session and confirm the six named events arrive in PostHog; the run itself observed no event delivery.
- [ ] Because authentication and identification are wired, verify a returning authenticated session calls identify and does not fragment onto an anonymous distinct ID.
