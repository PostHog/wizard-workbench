# Replay Vision readiness report

> ❌ **Session replay is off.** A project admin must turn on **Record user sessions** under **Settings → Session replay** before any Replay Vision scanner can observe sessions.

> 🚀 **Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `package.json`, `pnpm-lock.yaml`, and `src/main.tsx`, and set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in the production environment.

This project started without PostHog. The browser SDK (`posthog-js`) is now installed and initialized in the React/Vite app, ready to record once the deployment and replay setting are in place.

There were **0 recordings in the last 30 days**. Replay Vision scanners cost nothing until recordings arrive. After the first eligible recording completes, scanners can begin observing it—provided replay is enabled and the scanners are created with an authorized credential.

## Replay Vision scanners

No scanners were created or updated in this run. The available credential lacks Replay Vision scanner read/write and session-recording read permissions, so inventory, quota, estimates, and creation were unavailable. The following scanners are prepared for creation once those permissions are available:

### Padel court booking problems

- **Watches:** court-list or booking-form loading failures; a selected court showing “Court not found.”; an unresponsive time-slot selector; a Confirm booking action that does nothing; and a missing booking confirmation.
- **Query scope:** all recordings (`RecordingsQuery`), with no filters.
- **Planned sampling:** 100%.
- **Planned spend:** **Free credits only**. It will pause when the organization’s free credits are exhausted; a paid estimate could not be retrieved with the available permissions.

### Booking outcome

- **Watches:** whether people complete the booking flow—from selecting a padel court and time slot through submitting Confirm booking and reaching the booking confirmation.
- **Query scope:** all recordings (`RecordingsQuery`), with no filters.
- **Planned sampling:** 100%.
- **Planned spend:** **Free credits only**. It will pause when free credits are exhausted; an estimated monthly credit amount could not be retrieved with the available permissions.

### Court booking session summaries

- **Watches:** session summaries using the app vocabulary: courts, time slots, and bookings, including browsing courts, selecting a time slot, and confirming a booking.
- **Query scope:** all recordings (`RecordingsQuery`), with no filters.
- **Planned sampling:** 100%.
- **Planned spend:** **Free credits only**. It will pause when free credits are exhausted; an estimated monthly credit amount could not be retrieved with the available permissions.

## What remains

1. A project admin enables **Record user sessions** in **Settings → Session replay**.
2. Deploy the browser integration with `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` configured in production.
3. Use a credential with `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` to inspect existing scanners and quota, retrieve estimates, and create or update the prepared scanners.

## Where to look

Results will appear on the **Replay Vision** page in PostHog. The first observations arrive as new recordings complete after session replay is enabled and the deployed app begins producing recordings.
