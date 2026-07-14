# PostHog post-wizard report

The wizard completed a Next.js App Router PostHog integration with client and server SDK setup, client identification for authenticated sessions, a Next.js rewrite proxy, environment variable wiring through `.env.local`, and targeted event capture across auth, billing, account management, and pricing flows. A reverse-proxy client init was added in `instrumentation-client.ts`, a shared server client was added for short-lived route handlers and server actions, and the root layout now identifies returning authenticated users automatically. A production build was attempted, but verification is currently blocked by an existing missing `POSTGRES_URL` environment variable unrelated to the PostHog changes.

| Event name | Description | File |
| --- | --- | --- |
| `sign_in_submitted` | Captures a sign-in form submission before the server action runs. | `app/(login)/login.tsx` |
| `sign_up_submitted` | Captures a sign-up form submission before the server action runs. | `app/(login)/login.tsx` |
| `user_signed_in` | Captures a successful account sign-in after credentials are validated. | `app/(login)/actions.ts` |
| `user_signed_up` | Captures successful account creation for a new user. | `app/(login)/actions.ts` |
| `user_signed_out` | Captures an authenticated user signing out of the application. | `app/(login)/actions.ts` |
| `account_updated` | Captures successful changes to account profile details. | `app/(login)/actions.ts` |
| `password_updated` | Captures successful password changes for authenticated users. | `app/(login)/actions.ts` |
| `account_deleted` | Captures when a user successfully deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Captures when an owner successfully sends a team invitation. | `app/(login)/actions.ts` |
| `team_member_removed` | Captures when a team member is removed from a workspace. | `app/(login)/actions.ts` |
| `checkout_started` | Captures when a signed-in user begins the checkout flow for a selected plan. | `lib/payments/actions.ts` |
| `billing_portal_opened` | Captures when a user opens the customer billing portal. | `lib/payments/actions.ts` |
| `checkout_completed` | Captures when a Stripe checkout session is successfully completed and the team subscription is updated. | `app/api/stripe/checkout/route.ts` |
| `subscription_status_updated` | Captures webhook-driven subscription lifecycle changes from Stripe. | `app/api/stripe/webhook/route.ts` |
| `pricing_cta_clicked` | Captures when a visitor clicks the pricing call to action for a plan. | `app/(dashboard)/pricing/submit-button.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846746)
- Insight: [Signups over time (wizard)](https://us.posthog.com/project/483112/insights/larnNeOG)
- Insight: [Checkout starts over time (wizard)](https://us.posthog.com/project/483112/insights/eTuidtgd)
- Insight: [Checkout completion funnel (wizard)](https://us.posthog.com/project/483112/insights/ZT6OHTkA)
- Insight: [Team invitations sent (wizard)](https://us.posthog.com/project/483112/insights/Kabv5eMP)
- Insight: [Account deletions over time (wizard)](https://us.posthog.com/project/483112/insights/SEulS79O)
- Notebook: could not be created because the current PostHog MCP credentials are missing `notebook:write` scope.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added in this run to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — this integration adds a layout-level identify path, but it should be validated in a real signed-in browser session.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
