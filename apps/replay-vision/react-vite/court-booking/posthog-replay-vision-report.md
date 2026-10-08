# Replay vision setup report

> ⚠️ **Needs your attention**
> - Session replay is not recording yet, and no scanners could be created. The PostHog MCP connection's personal API key is missing the scopes `product_enablement:write`, `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`. Add these scopes to the key (the change reaches the connection within ~2 minutes), then re-run the replay-vision setup to finish enabling recording and create the three scanners below.
> - Until that's fixed, you can also enable recording manually in the PostHog UI: [Settings → Session replay](https://us.posthog.com/project/483112/settings/environment-replay) → "Record user sessions".

## What changed

This project started with no PostHog integration. The run:

- Installed `posthog-js@^1.438.2` as a dependency (via pnpm).
- Initialized the client in `src/main.tsx` — the app's single entry point — with a guarded `posthog.init(posthogKey, { api_host: posthogHost })` call, reading `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST` from env. Both are already set in `.env`, and `.env.example` documents them for other developers.
- Left all PostHog defaults in place: autocapture and session recording are not disabled anywhere in the config.

## Recording status: not yet active

Session replay will **not** record sessions until it's turned on at the project level. The client-side code is ready and has nothing blocking it — once the server-side flag flips, recordings will start flowing with no further code changes.

To enable it, either:
1. Add the `product_enablement:write` scope to the MCP connection's API key and re-run this setup, or
2. Go to [Settings → Session replay](https://us.posthog.com/project/483112/settings/environment-replay) in the PostHog UI and turn on "Record user sessions" yourself.

## Scanners: none created yet (blocked, not skipped)

This is a padel court-booking SPA (browse courts → pick a time slot → confirm booking, at `/`, `/book/:courtId`, `/confirmation`). All three standard scanners were drafted against this product but could not be created — the API key behind the MCP connection lacks `replay_scanner:read`/`replay_scanner:write`/`session_recording:read`, so every scanner tool call was rejected before reaching PostHog. Nothing was partially created; there's no duplicate-cleanup needed on retry.

Once scopes are fixed, re-running the setup will create:

| Scanner | Watches for | Query scope | Notes |
|---|---|---|---|
| **Court booking failures** | Moments where the product visibly broke — e.g. a time slot shown as available with no real availability check, landing on a confirmation page with no court/date/time, or a "Court not found" error | Recordings touching `/book` or `/confirmation` | Type: monitor |
| **Court booking frustration** | Clear signs of a stuck or frustrated user — repeated "Book" clicks with no response, reopening the time-slot dropdown multiple times, hammering "Confirm booking" or "Book another slot" | Recordings with rage-click events (`$rageclick`) | Type: monitor |
| **Court booking session summaries** | Plain-language summary of what each user did in a session (browsing courts, picking a slot, confirming a booking) | 10% sample of all recordings (unscoped) | Type: summarizer, sampling_rate 0.1 |

Estimated monthly credit spend for each scanner could not be calculated — the size/cost estimate tools (`vision-scanners-estimate`, `vision-quota-get`) are gated behind the same missing scopes. Run the estimate once scopes are restored, before the scanners go live, to confirm spend is within budget.

## Where results will appear

Once recording is enabled and the scopes above are fixed, everything shows up on the **Replay vision** page in PostHog ([us.posthog.com/project/483112](https://us.posthog.com/project/483112)) — new recordings populate it, and scanner observations arrive as those recordings are processed.

## Summary

- ✅ PostHog SDK installed and initialized in a previously bare React + Vite app.
- ⚠️ Session replay recording: blocked on a scope fix or a manual UI toggle.
- ⚠️ 3 scanners drafted (failures, frustration, session summaries) but not created: blocked on the same scope issue.
- Next step for you: add `product_enablement:write`, `replay_scanner:read`, `replay_scanner:write`, `session_recording:read` to the MCP connection's API key, then re-run.
