# PostHog post-wizard report

The wizard integrated PostHog analytics for this Next.js App Router SaaS. It installed the browser and Node SDKs, initializes browser analytics through `instrumentation-client.ts`, enables exception capture, and adds authenticated-person identification on returning sessions. Server-side capture uses stable database-derived IDs and flushes each short-lived request before returning. PostHog configuration is stored in `.env.local` via `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Tracks a successful user sign-in from the server action. | `app/(login)/actions.ts` |
| `user_signed_up` | Tracks successful account creation and whether it resulted from an invitation. | `app/(login)/actions.ts` |
| `account_updated` | Tracks a successful account profile update. | `app/(login)/actions.ts` |
| `password_updated` | Tracks a successful password update. | `app/(login)/actions.ts` |
| `team_member_invited` | Tracks a successful team invitation with the selected role. | `app/(login)/actions.ts` |
| `team_member_removed` | Tracks a successful team-member removal. | `app/(login)/actions.ts` |
| `checkout_completed` | Tracks a verified Stripe checkout completion. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Tracks Stripe subscription changes received through the webhook. | `app/api/stripe/webhook/route.ts` |

## Next steps

The PostHog MCP endpoint was unavailable during this run, so the requested dashboard, insights, and shareable notebook could not be created. Create an **Analytics basics (wizard)** dashboard in PostHog after the MCP service is available, using the events listed above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
