<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the React Router v7 (Framework mode) SaaS template. The integration includes client-side analytics via `posthog-js` with a `PostHogProvider` wrapper, a server-side PostHog middleware using `posthog-node` that correlates browser sessions with server events via automatic tracing headers, user identification on every authenticated page load, and 14 tracked events spanning the full user lifecycle from registration through subscription management and content creation.

Key infrastructure changes:
- **`app/lib/posthog-middleware.ts`** (new) — React Router v7 middleware that creates a `posthog-node` client per request, reads `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` tracing headers, and exposes the client via `posthogContext`.
- **`app/entry.client.tsx`** — Initialises `posthog-js` with reverse-proxy API host (`/ingest`), adds `PostHogProvider` wrapping `HydratedRouter`.
- **`app/root.tsx`** — Adds `posthogMiddleware` to the root middleware array; adds `captureException` in the root `ErrorBoundary`.
- **`vite.config.ts`** — Adds `ssr.noExternal` for `posthog-js`/`@posthog/react` and configures the `/ingest` reverse proxy.
- **`app/routes/…/_sidebar-layout.tsx`** — Calls `posthog.identify(userId, { name, email })` on every authenticated page load to link anonymous events to the user.

| Event | Description | File |
|---|---|---|
| `user_registered` | User submits registration form and is sent an email verification link. | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_logged_in` | User submits login form and is sent an email verification link. | `app/features/user-authentication/login/login-action.server.ts` |
| `user_logged_out` | User clicks the logout button in the sidebar user menu. | `app/features/organizations/layout/nav-user.tsx` |
| `organization_created` | User successfully creates a new organization. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `member_invited` | An admin or owner invites a new member to the organization by email. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `subscription_checkout_started` | User initiates a Stripe checkout session to subscribe to a plan. | `app/features/billing/billing-action.server.ts` |
| `subscription_cancellation_started` | User begins the subscription cancellation flow via the Stripe customer portal. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription that was scheduled for cancellation. | `app/features/billing/billing-action.server.ts` |
| `subscription_switched` | User initiates switching to a different subscription plan via the customer portal. | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | Stripe webhook confirms a checkout session was completed and subscription activated. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_created` | Stripe webhook confirms a new subscription was created for an organization. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted` | Stripe webhook confirms a subscription was deleted/cancelled for an organization. | `app/features/billing/stripe-event-handlers.server.ts` |
| `paste_created` | User creates a new paste in their organization's pastebin. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `paste_deleted` | User deletes an existing paste from their organization's pastebin. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818312)
- [User signups & logins over time](https://us.posthog.com/project/483112/insights/g6t9C77y)
- [Subscription checkout conversion funnel](https://us.posthog.com/project/483112/insights/tYXDXahU)
- [Subscription cancellations & deletions](https://us.posthog.com/project/483112/insights/vPT1SfWB)
- [Registrations by method](https://us.posthog.com/project/483112/insights/CdBuoHIr)
- [Paste activity](https://us.posthog.com/project/483112/insights/Ohe1txw1)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the sidebar layout calls it on every authenticated page load, but verify the onboarding flow also reaches identification before users complete their first organization setup.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
