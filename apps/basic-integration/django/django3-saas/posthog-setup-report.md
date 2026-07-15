# PostHog post-wizard report

PostHog analytics was added to the Django SaaS application using the Python SDK. The SDK is initialized during Django startup from environment variables, request context middleware associates events with authenticated users and sessions, and key authentication, subscription, and project-management actions are captured with stable user IDs. Exception autocapture is enabled through the SDK and middleware.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Tracks a successful user login. | `accounts/views.py` |
| `user_signed_up` | Tracks a completed account registration. | `accounts/views.py` |
| `subscription_started` | Tracks a subscription created through demo checkout or Stripe checkout completion. | `billing/views.py` |
| `subscription_canceled` | Tracks a subscription cancellation. | `billing/views.py` |
| `project_created` | Tracks a user creating a project. | `dashboard/views.py` |
| `project_deleted` | Tracks a user deleting a project. | `dashboard/views.py` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP server was unavailable in this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — instrumented call sites may need updated mocks or fixtures.
- [ ] Add the exact PostHog environment variable names to deployment configuration and confirm they are set in each environment.
- [ ] Confirm the returning-visitor path identifies authenticated users, not only fresh login and signup requests.

### Agent skill

The installed integration skill is available in `.claude/skills/integration-django` for future agent development.
