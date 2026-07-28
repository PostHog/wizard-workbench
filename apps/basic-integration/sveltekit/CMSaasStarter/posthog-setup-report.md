# PostHog setup report

PostHog browser analytics, authenticated-user identity, client error tracking, five product events, and an analytics dashboard were set up for this SvelteKit app.

## Installed and initialized

- Installed `posthog-js` (`^1.405.2`) and `posthog-node` (`^5.46.0`) with npm; `package.json` and `package-lock.json` were updated. The install completed successfully, with existing deprecation and audit warnings.
- `src/hooks.client.ts` initializes one shared browser PostHog client from `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`. Missing configuration produces development-only errors and a production no-op; no second client initialization was added.
- `.env.example` documents both variables, and the real values were configured in `.env` through the wizard environment tools.
- `svelte.config.js` sets `kit.paths.relative: false` for SSR session replay compatibility.
- No Content-Security-Policy was found in `src`, so no CSP changes were made.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `contact_form_submitted` | A visitor successfully submits the contact form. | `src/routes/(marketing)/contact_us/+page.svelte` |
| `profile_created` | An authenticated user successfully creates their profile. | `src/routes/(admin)/account/create_profile/+page.svelte` |
| `account_settings_updated` | An authenticated user successfully saves a non-destructive account settings form. | `src/routes/(admin)/account/(menu)/settings/settings_module.svelte` |
| `account_deletion_requested` | An authenticated user successfully requests account deletion. | `src/routes/(admin)/account/(menu)/settings/settings_module.svelte` |
| `subscription_plan_selected` | A visitor or authenticated user selects a subscription plan to begin checkout. | `src/routes/(marketing)/pricing/pricing_module.svelte` |

The event plan records non-PII context properties only: `settings_area`, `plan_id`, and `selection_context`. The run verified that each planned event has a corresponding `posthog.capture` call at the relevant successful action or selection. The run did **not** observe events arriving in PostHog, so event delivery and dashboard population remain unconfirmed.

## Identity and error tracking

User identification was wired for authenticated browser sessions. `src/routes/(admin)/account/+layout.svelte` calls `identify()` with the stable Supabase `user.id` on account-layout mount and `SIGNED_IN` transitions, sends optional email/name as person properties rather than event properties, and resets before an account switch. `src/routes/(admin)/account/sign_out/+page.svelte` resets PostHog after successful sign-out. Public contact and pricing events remain personless until identity is known. Server-side captures were not added, so server events and request-scoped server attribution remain unimplemented.

`src/hooks.client.ts` exports SvelteKit's global `handleError` hook and calls the shared client's `captureException(error)` when initialized, while preserving the `{ message, status }` response. Server-side error tracking was not added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914321) contains five tagged insights for the instrumented events. The insights use 30-day daily trends; the subscription insight is broken down by `plan_id`. The dashboard and insights were created successfully, but their data was not verified because the run did not observe incoming events.

[DASHBOARD_URL] https://us.posthog.com/project/483112/dashboard/1914321

## Verification and unresolved issues

- `npm install` completed successfully.
- `npm run lint` passed before and after the review fix.
- `npm run check` failed with 12 pre-existing missing `$env/static` exports for Supabase and Stripe in seven non-integration source files.
- `npm run build` failed on the same pre-existing environment problem, first reporting the missing `PUBLIC_SUPABASE_URL` export in `src/routes/(admin)/account/+layout.ts`.
- The build and typecheck conflict is outside the PostHog changeset and must be resolved before a production build can be trusted.
- No server SDK instrumentation was added, so subscription completion, contact persistence, and account mutations are not captured as server-side events. Leaving this unresolved limits attribution to the client interactions and does not provide server-confirmed business outcomes.

## Before you merge

- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`; verify the exact names documented in `.env.example`.
- [ ] Resolve the pre-existing Supabase/Stripe environment exports, then run a full production build and fix any lint or type errors introduced by the integration; specifically inspect `src/routes/(admin)/account/+layout.ts` and the seven files reported by `npm run check`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites if needed.
- [ ] Trigger each instrumented client path in a deployed or configured environment and confirm the five event names arrive in PostHog; the run itself did not verify delivery.
- [ ] Confirm the returning authenticated-user path reaches `identify()` in `src/routes/(admin)/account/+layout.svelte`, so returning sessions do not fragment onto anonymous distinct IDs.
- [ ] Decide whether server-side instrumentation is required, then add request-scoped identity and flush handling for the server actions that persist contact, profile/settings, deletion, and subscription outcomes; no server captures were added in this run.
