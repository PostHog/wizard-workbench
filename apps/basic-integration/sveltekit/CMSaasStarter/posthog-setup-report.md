<wizard-report>
# PostHog post-wizard report

The wizard completed a SvelteKit PostHog integration across both client and server surfaces. It installed `posthog-js` and `posthog-node`, added browser initialization with a SvelteKit ingest proxy, added a server-side PostHog helper plus server error capture, identified authenticated users on account loads and sign-ins, and instrumented key business actions across auth, profile management, billing, pricing, contact, password recovery, and sign-out flows.

| Event | Description | File |
| --- | --- | --- |
| contact_request_submitted | Tracks successful contact form submissions for inbound lead conversion. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| user_signed_in | Tracks successful sign-in after the auth callback establishes a returning session. | `src/routes/(marketing)/auth/callback/+server.js` |
| profile_created | Tracks completion of the required onboarding profile form. | `src/routes/(admin)/account/api/+page.server.ts` |
| profile_updated | Tracks profile edits after onboarding is complete. | `src/routes/(admin)/account/api/+page.server.ts` |
| checkout_started | Tracks when a signed-in user starts a paid checkout flow. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| billing_portal_opened | Tracks when a user opens Stripe billing management. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| email_subscription_toggled | Tracks when a user updates their marketing email subscription preference. | `src/routes/(admin)/account/api/+page.server.ts` |
| email_change_requested | Tracks when a user requests an account email change. | `src/routes/(admin)/account/api/+page.server.ts` |
| password_changed | Tracks successful password changes from account settings or recovery. | `src/routes/(admin)/account/api/+page.server.ts` |
| password_reset_requested | Tracks when a signed-in user requests a password reset email from settings. | `src/routes/(admin)/account/(menu)/settings/change_password/+page.svelte` |
| account_deleted | Tracks confirmed account deletions. | `src/routes/(admin)/account/api/+page.server.ts` |
| pricing_cta_clicked | Tracks plan selection clicks from pricing modules before checkout starts. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| user_signed_out | Tracks explicit user sign-out completion in the client. | `src/routes/(admin)/account/sign_out/+page.svelte` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831104)
- [Sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/V6OIYrqd)
- [Pricing CTA clicks by plan (wizard)](https://us.posthog.com/project/483112/insights/0didzVg7)
- [Checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/5VY8iP2i)
- [Profiles created vs updated (wizard)](https://us.posthog.com/project/483112/insights/bpGVAiiB)
- [Contact requests submitted (wizard)](https://us.posthog.com/project/483112/insights/JUrqoUPC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
