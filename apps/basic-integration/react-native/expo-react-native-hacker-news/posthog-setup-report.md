# PostHog setup report

PostHog React Native analytics, anonymous action instrumentation, global React error tracking, and a starter dashboard were added to this Expo Hacker News reader.

## Installed and initialized

- Installed `posthog-react-native` `^4.61.0` with npm; `react-native-svg` `15.12.1` was already present as the required peer dependency. The lockfile resolves SDK version 4.61.0.
- Configured `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` in `.env`; documented both names in `.env.example`.
- `lib/posthog.ts` creates one client from those environment variables. In development, missing variables produce the required configuration errors; in production, missing configuration leaves analytics disabled rather than breaking boot.
- `app/_layout.tsx` mounts `PostHogProvider` and the error boundary when configuration exists. Manual captures safely no-op when analytics is deliberately unconfigured.

## Instrumented events

These events were added to the listed call sites. The run verified the source calls and event contract, but did **not** run the app or observe any event arriving in PostHog; delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `story_type_selected` | Reader selects a Hacker News story-feed category. | `components/Select.tsx` |
| `post_opened` | Reader opens an in-app post or its comments. | `components/posts/Post.tsx` |
| `external_story_opened` | Reader opens an external story from the feed. | `components/posts/Post.tsx` |
| `story_link_opened` | Reader opens the external source from a story detail view. | `app/[itemId].tsx` |
| `user_profile_opened` | Reader opens a public Hacker News author profile. | `app/[itemId].tsx` |
| `comment_thread_opened` | Reader opens a comment thread. | `components/comments/comment.tsx` |
| `parent_context_opened` | Reader navigates from a comment to its parent discussion context. | `app/[itemId].tsx` |

Event properties contain public content IDs and interaction sources only. Public Hacker News author handles are not sent as event properties.

## Identity

User identification was **skipped**. This is a read-only client with no login, registration, persisted application session, logout flow, or authenticated account identifier. Captures therefore remain anonymous and rely on PostHog's anonymous device/session attribution. Hacker News author usernames are content identities, not app-user identities. If authentication is added later, identify with the authenticated account's stable internal ID after login/registration and reset on logout.

## Error tracking

`PostHogErrorBoundary` was added at the Expo Router root in `app/_layout.tsx`, inside the configured provider, with a non-PII source property. It is intended to send `$exception` events for uncaught React rendering errors. The run verified the boundary wiring but did not trigger an error or observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918320) was created with five insights: Story engagement over time, Feed preferences, Discussion navigation, Reader exploration, and Story-to-source exploration funnel. They use the seven event names above and cover the last 30 days. The run did not verify populated data; fresh insights may remain empty until the app sends events.

## Verification and conflicts

- `npm install` completed successfully and dependencies were up to date.
- The run re-read the edited integration files and confirmed the event calls, provider/boundary nesting, and event contract.
- No app build or typecheck script exists in `package.json`.
- `npm run lint` could not lint the project because the pre-existing ESLint 9 flat-config migration is incomplete: ESLint 9.39.2 cannot find any `eslint.config.*` file. This is the full known build/verification conflict; no build or typecheck was run.
- No app session was run, so event delivery, exception delivery, and dashboard population are unconfirmed.

## Open issue to resolve

The integration has no stable authenticated distinct ID because the app has no authentication boundary. If the product later adds accounts but leaves the current anonymous captures unchanged, events will remain fragmented across anonymous IDs until identification and logout reset are wired. Do not use Hacker News author handles as a substitute.

## Next steps

1. Configure the exact `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` names in every deployment environment, not only local `.env`.
2. Run the app and exercise each instrumented action, then confirm the seven event names arrive in PostHog and populate the dashboard.
3. Trigger a controlled rendering error and confirm `$exception` appears in PostHog.
4. Complete the ESLint 9 flat-config migration, then rerun lint; add and run the project’s available tests.
5. Run a full production build and fix any integration errors. If authentication is introduced, wire identify/reset at the authenticated session boundary.

## Before you merge

- [ ] Run a full production build and inspect `lib/posthog.ts` and `app/_layout.tsx`; no production build was available in this run.
- [ ] Run the test suite and update mocks or fixtures for captures in `components/Select.tsx`, `components/posts/Post.tsx`, `components/comments/comment.tsx`, and `app/[itemId].tsx`.
- [ ] Confirm `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` from `.env.example` are set in each deployment environment; check `lib/posthog.ts` lines 3–19.
- [ ] Complete the ESLint 9 configuration and rerun lint; inspect the root lint configuration and the integration files above.
- [ ] Launch the app and verify event delivery and `$exception` delivery in PostHog; inspect the capture call sites in the four files above and the boundary in `app/_layout.tsx`.
