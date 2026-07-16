# PostHog post-wizard report

The wizard added PostHog browser and server SDKs, client initialization through `instrumentation-client.ts`, and a Next.js ingestion proxy. It configured client-visible PostHog environment variables in `.env.local` and documented their names in `.env.example`. Authenticated users are identified on sign-in, sign-up, and returning visits; logout resets the browser identity. Server-side events are flushed before API responses return, and relevant client and server error paths capture exceptions.

| Event name | Description | File |
| --- | --- | --- |
| `pricing_checkout_started` | A visitor starts checkout for a selected subscription plan. | `pages/pricing.tsx` |
| `user_signed_in` | An authenticated user successfully signs in. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A new user account is created successfully. | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | An authenticated user creates a Stripe checkout session. | `pages/api/stripe/create-checkout.ts` |
| `subscription_checkout_completed` | A successful Stripe checkout updates a team subscription. | `pages/api/stripe/checkout.ts` |
| `team_member_invited` | A team owner sends an invitation to a new member. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team owner removes a member from the team. | `pages/api/team/remove-member.ts` |
| `account_updated` | An authenticated user updates their account settings. | `pages/api/account/update.ts` |

## Next steps

The PostHog MCP service was unavailable while attempting to create the requested dashboard and notebook, so no live PostHog links were created. Create an **Analytics basics (wizard)** dashboard in PostHog after the MCP service is available and add insights using the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
