# PostHog post-wizard report

The wizard integrated PostHog analytics across the Next.js App Router client and server. It installed `posthog-js` and `posthog-node`, initialized browser analytics in `instrumentation-client.ts`, configured local environment variables, and added server-side tracking for authentication and subscription checkout. Authenticated browser sessions identify users using the stable database user ID; email, name, and role are sent only as person properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Captures a successful authenticated sign-in on the server. | `app/(login)/actions.ts` |
| `user_signed_up` | Captures successful account creation and whether the user joined an existing team. | `app/(login)/actions.ts` |
| `checkout_initiated` | Captures when an authenticated team starts a subscription checkout. | `lib/payments/actions.ts` |
| `checkout_completed` | Captures when Stripe checkout has completed and the team subscription is updated. | `app/api/stripe/checkout/route.ts` |
| `user_signed_out` | Captures an authenticated user signing out from the application. | `app/(dashboard)/layout.tsx` |

## Next steps

The PostHog MCP dashboard service was unavailable in this run, so the requested dashboard, insights, and shareable notebook could not be created. The configured events are ready to use once the service is available.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in `.claude/skills/integration-nextjs-app-router` for future PostHog development.
