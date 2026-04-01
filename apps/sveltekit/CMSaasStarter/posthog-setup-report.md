<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this SvelteKit SaaS starter application. The integration covers client-side initialization with session replay, a server-side PostHog singleton with reverse proxy (to avoid ad blockers), user identification on sign-in/sign-up via Supabase Auth state changes, and server-side event tracking for critical business operations including subscription checkout, billing portal, contact form submissions, and account lifecycle events (profile created/updated, sign-out, account deletion). Error tracking is enabled on both client and server sides via `captureException` and `handleError` hooks respectively.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired client-side when Supabase signals a successful sign-in; also calls `posthog.identify()` | `src/routes/(marketing)/login/sign_in/+page.svelte` |
| `user_signed_up` | Fired client-side when Supabase signals a new sign-up; also calls `posthog.identify()` | `src/routes/(marketing)/login/sign_up/+page.svelte` |
| `user_signed_out` | Server-side event captured when the signout form action completes | `src/routes/(admin)/account/api/+page.server.ts` |
| `account_deleted` | Server-side event captured when a user's account is deleted | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_created` | Server-side event captured when a user creates their profile for the first time | `src/routes/(admin)/account/api/+page.server.ts` |
| `profile_updated` | Server-side event captured when a user updates their profile | `src/routes/(admin)/account/api/+page.server.ts` |
| `subscription_checkout_started` | Server-side event when a user initiates a Stripe checkout session (includes `price_id`) | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `subscription_portal_opened` | Server-side event when a user opens the Stripe billing portal | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `contact_form_submitted` | Server-side event when a user successfully submits the contact form | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `pricing_plan_selected` | Client-side event when a user clicks a pricing plan CTA (includes `plan_id`, `plan_name`) | `src/routes/(marketing)/pricing/pricing_module.svelte` |

## Next steps

Build an **Analytics basics** dashboard in your PostHog project to monitor these events:

- **[PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)** — create a new dashboard named "Analytics basics"

Suggested insights to add:

1. **Sign-up Funnel** — Funnel: `user_signed_up` → `profile_created` → `subscription_checkout_started`
   [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

2. **New Sign-ups Over Time** — Trend: `user_signed_up`
   [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

3. **Subscription Checkout Rate** — Trend: `subscription_checkout_started` vs `user_signed_up`
   [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

4. **Account Churn** — Trend: `account_deleted` over time
   [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

5. **Contact Form Submissions** — Trend: `contact_form_submitted`
   [Create in PostHog](https://us.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
