# Replay Vision setup report

**Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `src/main.tsx`, `package.json`, and `pnpm-lock.yaml`, and set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in the production deployment environment. The app did not have PostHog when this workflow began; it now has the browser SDK installed and initialized.

Session replay is enabled in this PostHog project, but there are currently **0 recordings** in the last 30 days (and 0 scannable sessions in the recent sizing window). Scanners cost nothing until recordings arrive. Once the release reaches users, the scanners can begin observing the first completed recordings. If people already use the app, the version they run may not yet include the PostHog SDK.

## Scanner status

No Replay Vision scanners were created or updated in this run because this connection does not expose the required scanner create or update operation.

### Booking problems — deferred

- **What it will watch:** Problems in the padel-court booking journey: a court not found, unavailable or unselectable time slots, booking confirmation that does not proceed, or a failed confirmation screen.
- **Query scope:** All recordings (`RecordingsQuery`), with no additional filter.
- **Estimated monthly credit spend:** 0 credits at the current zero-session volume. When write tooling is available, it should be re-sized against actual traffic and configured free-only for the current low/unknown-volume tier.
- **Why deferred:** Scanner creation is unavailable in the connected PostHog tooling.

### Padel booking session summaries — deferred update

- **What it will watch:** Summaries of sessions involving padel courts, court surfaces, time slots, and bookings—especially browsing courts, selecting a time slot, and confirming a booking.
- **Query scope:** A matching legacy summarizer already exists with an unfiltered `RecordingsQuery`, 10% sampling, and non-free-only configuration. It should be updated in place rather than duplicated.
- **Estimated monthly credit spend:** No new or updated scanner ran in this workflow; at current zero-session volume, the recorded sizing estimate is 0 credits per month. Any update should be re-estimated before it is saved.
- **Why deferred:** The scanner update operation is unavailable in the connected PostHog tooling. Free-only credits remaining are also 0; a newly created free-only low-tier scanner would need 1% sampling and pause until free credits are available.

## Where to look

Open the **Replay vision** page in PostHog. The first observations will appear there as new session recordings complete after the deployed app reaches users.
