# PostHog post-wizard report

PostHog has been integrated into the React Router 7 Framework application. The browser SDK and React bindings are initialized in the client entry point using environment variables, with tracing headers enabled for server correlation. A request-scoped Node SDK middleware was added for server-side events and exception autocapture, and the root error boundary reports route exceptions. Meaningful authentication, onboarding, billing, and checkout actions are instrumented without placing user-entered PII in event properties.

| Event | Description | File |
|---|---|---|
| `login_requested` | Tracks a user submitting the email or Google login flow. | `app/features/user-authentication/login/login-action.server.ts` |
| `registration_requested` | Tracks a user submitting the email or Google registration flow. | `app/features/user-authentication/registration/register-action.server.ts` |
| `organization_created` | Tracks successful completion of organization onboarding. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `billing_action_requested` | Tracks a user requesting a billing action. | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_started` | Tracks a user starting a subscription checkout session. | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Tracks a successfully completed Stripe checkout webhook. | `app/routes/api+/v1+/stripe.webhooks.ts` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP server was unavailable during this run. No dashboard or insight links were created.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented server actions may need updated mocks or fixtures.
- [ ] Confirm the PostHog environment variable names are present in deployment configuration.
- [ ] Wire source-map upload into CI so production browser stack traces de-minify.

### Agent skill

The PostHog integration skill folder remains available under `.claude/skills/integration-react-react-router-7-framework`.
