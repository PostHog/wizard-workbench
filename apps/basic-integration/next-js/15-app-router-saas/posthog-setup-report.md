# PostHog post-wizard report

PostHog product analytics was integrated for the Next.js App Router application. Client-side initialization is in `instrumentation-client.ts` using environment variables, and server-side tracking uses a flushed `posthog-node` singleton. Authentication, account lifecycle, team invitations, checkout completion, and subscription changes are tracked with stable database user IDs. Login and signup identify users with person properties; event properties avoid user-entered PII.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_logged_out` | An authenticated user signs out. | `app/(login)/actions.ts` |
| `checkout_completed` | A checkout return successfully activates a team subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | A Stripe subscription update or cancellation is processed. | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | An authenticated user successfully invites a teammate. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user successfully deletes their account. | `app/(login)/actions.ts` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable in this run. No dashboard URL or notebook URL is available.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented server actions and routes may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and deployment configuration.
- [ ] Wire source-map upload into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path identifies an already authenticated user, not only fresh login/signup sessions.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code.
