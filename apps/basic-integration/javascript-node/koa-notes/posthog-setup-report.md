# PostHog setup report

PostHog server-side analytics was installed and wired into the Koa notes API for mutation events and application errors, with a starter dashboard configured.

## What was installed and initialized

- Installed `posthog-node` at `^5.46.1` using npm; `npm install` completed successfully with 83 audited packages and no vulnerabilities.
- Added one shared client in `posthog.js`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables.
- The client enables `enableExceptionAutocapture`, uses `flushAt: 1` and `flushInterval: 0`, and route captures await `flush()`.
- Development startup fails loudly when configuration is missing; production exports a safe no-op client. The package scripts load `.env` with Node's `--env-file=.env`.
- `.env.example` documents the required keys, and the run recorded both real keys as configured locally through wizard tools.

## Instrumented events

The following events were added to successful mutation completion points in `index.js`. The run did not exercise the application or observe any event arriving in PostHog, so these are instrumented contracts, not confirmed deliveries.

| Event | What it measures | File |
|---|---|---|
| `folder_created` | A notes folder was successfully created, including folder ID and name length | `index.js` |
| `folder_deleted` | A non-default folder was successfully deleted and its notes moved to General, including moved-note count | `index.js` |
| `note_created` | A note was successfully created, including note/folder IDs and title/content lengths | `index.js` |
| `note_updated` | An existing note was successfully updated, including changed-field flags and resulting content lengths | `index.js` |
| `note_deleted` | An existing note was successfully deleted, including note and folder IDs | `index.js` |

No event capture was observed during this run. The dashboard insights are therefore expected to be empty until the application receives traffic.

## User identification

Identification was skipped. The API has no authentication, login/signup flow, session, user model, or documented stable incoming user identifier. No distinct ID was invented from folder IDs, note IDs, titles, content, or request fields. If stable identity is added later, bind it at the request boundary before route captures and error reporting.

## Error tracking

`index.js` registers one Koa app-level `error` listener. When the shared client is available, it calls `posthog.captureException(err)` and awaits `posthog.flush()`. The shared client also has exception autocapture enabled. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902611) contains four `(wizard)` insights covering content creation activity, note lifecycle changes, folder lifecycle activity, and a folder-to-note activity funnel. The dashboard and insights were created successfully, but no event volume was required or observed.

## Build and verification status

There was no build conflict. `npm install` succeeded, and the review confirmed there are no build, typecheck, or lint scripts in `package.json`. Consequently, no build, typecheck, lint, application startup, test suite, or live event-flow verification was run. The review assumed Node's `--env-file` support, consistent with the installed SDK's Node 20.20-or-later requirement.

## Issues to follow up

- **Live delivery is unresolved:** no route was exercised and no event was observed arriving in PostHog. Until verified, the five event contracts and error delivery should be treated as unconfirmed; leaving this unresolved risks a dashboard that remains empty despite apparently valid code.
- **Identity attribution is unresolved by design:** there is no stable user identifier in the current API. Events and errors remain personless. If user-level attribution is needed, leaving this unresolved prevents retention, user-level segmentation, and reliable per-user error analysis.

## Before you merge

- [ ] Run a full production build or equivalent startup validation and fix any errors introduced by the integration; the review found no build script, so this remains unverified. Check `package.json` scripts and `posthog.js` initialization.
- [ ] Run the test suite and update mocks or fixtures for the awaited PostHog capture/flush behavior. Check the mutation handlers and error listener in `index.js` (capture call sites are around lines 39–43, 64–65, 101–108, 142–151, and 169–173).
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`; check `.env.example`, `posthog.js`, and deployment/bootstrap configuration.
- [ ] Exercise successful folder and note mutations plus an error path, then confirm the five named events and the exception appear in PostHog. Check the corresponding call sites in `index.js` and the dashboard linked above.
- [ ] If authenticated identity is introduced later, wire a stable user ID at the request boundary before relying on person-level analytics; check the request/auth boundary and the route/error instrumentation in `index.js`.
