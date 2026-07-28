# PostHog setup report

PostHog was installed and initialized for the Next.js App Router, with authenticated identity, product-event capture, global client error capture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.407.5` and `posthog-node` `^5.46.1` with the detected pnpm package manager. The manifest and lockfile were updated.
- Browser initialization lives in `instrumentation-client.ts` and reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from the environment. It initializes PostHog once, enables exception capture, and fails loudly in non-production when configuration is missing.
- The environment keys are documented in `.env.example` and were present in the local environment during review.
- Server capture lives in `lib/posthog/server.ts`, uses the server SDK, and awaits flushes for request-bound events.
- No CSP changes were needed: the review found no CSP configuration in this app.

## Instrumented events

These are the events recorded in `.posthog-wizard-cache/.posthog-events.json` and wired at their execution points:

| Event | What it measures | File |
|---|---|---|
| `sign_in_completed` | An authenticated user successfully signs in. | `app/(login)/actions.ts` |
| `account_created` | A new user account and team membership are successfully created. | `app/(login)/actions.ts` |
| `password_updated` | An authenticated user successfully changes their password. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user successfully updates account settings. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner successfully creates a team invitation. | `app/(login)/actions.ts` |
| `team_member_removed` | An authenticated team member successfully removes another member. | `app/(login)/actions.ts` |
| `checkout_started` | An authenticated user submits a selected plan for checkout. | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_portal_opened` | An authenticated user submits the subscription management action. | `app/(dashboard)/dashboard/page.tsx` |
| `terminal_commands_copied` | A visitor copies the starter terminal commands. | `app/(dashboard)/terminal.tsx` |
| `checkout_completed` | A Stripe checkout session is successfully verified and applied to an account. | `app/api/stripe/checkout/route.ts` |

The run verified that the capture call sites exist and that the event plan matches them. It did **not** observe events arriving in PostHog; production event delivery was not browser-tested.

## User identification

Identification was wired in `app/(dashboard)/layout.tsx`. When `/api/user` returns an authenticated user, the browser identifies the user with `String(user.id)` and sends email, name, and role as person properties. Logout calls `posthog.reset()` before sign-out. Client events in the dashboard inherit this identity. The public `terminal_commands_copied` event is intentionally personless. Server events use authenticated database user IDs where available.

Stripe webhook subscription changes remain uninstrumented because the run could not establish a verified user identity at that webhook call site. Leaving this unresolved means subscription changes from that path cannot be reliably attributed to a user.

## Error tracking

`app/global-error.tsx` is a client global error boundary. It calls `posthog.captureException(error)` once for an uncaught client-rendered application error and provides a recovery action. `instrumentation-client.ts` also enables exception capture. The run verified the implementation files; it did not trigger an application error and therefore did not observe an exception arrive in PostHog.

## Dashboard

The starter dashboard **Analytics basics (wizard)** was created with four saved insights: account creation trend, checkout activity trend, signup-to-checkout conversion funnel, and team collaboration activity. The dashboard and insights were saved successfully, but they may be empty until events arrive.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1918281)

## Build and review status

- `pnpm install` completed successfully with an up-to-date lockfile.
- The review found no integration-specific fixes needed and reported no unused helpers, unrelated changes, or pattern violations.
- `pnpm build` reached `Compiled successfully` and completed its built-in lint/type validity phase.
- The build did not finish because route-data collection hit the pre-existing missing environment variable: `Error: POSTGRES_URL environment variable is not set`, specifically while collecting page data for `/api/stripe/webhook`.
- No separate lint or typecheck script exists in `package.json`, so no separate commands were available.

## Next steps

1. Configure `POSTGRES_URL` in the build/deploy environment and rerun the full production build.
2. Run the test suite and update mocks or fixtures for the instrumented server actions and routes.
3. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment; `.env.example` contains the exact names.
4. Exercise sign-in, account creation, checkout, subscription portal, terminal copy, and relevant account/team actions in a deployed environment, then confirm the expected events arrive in PostHog.
5. Decide how Stripe webhook subscription changes should be attributed, then instrument that path only after a reliable user or team identity is available.

## Before you merge

- [ ] Run a full production build with `POSTGRES_URL` configured and fix any lint or type errors introduced by the generated integration; inspect `instrumentation-client.ts`, `lib/posthog/server.ts`, and the edited `app/` call sites if failures occur.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites, especially `app/(login)/actions.ts` and `app/api/stripe/checkout/route.ts`.
- [ ] Verify `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in deployment environments, not only local `.env`.
- [ ] Because auth identification is wired, verify a returning authenticated session reaches the `posthog.identify(String(user.id), ...)` effect in `app/(dashboard)/layout.tsx` so returning sessions do not remain on anonymous IDs.
- [ ] Confirm events and exceptions arrive in PostHog by exercising the relevant paths; the run itself did not verify delivery.
- [ ] Resolve attribution for Stripe webhook subscription changes before treating those changes as user-level analytics; the unresolved call site is the webhook path associated with `app/api/stripe/webhook`.
