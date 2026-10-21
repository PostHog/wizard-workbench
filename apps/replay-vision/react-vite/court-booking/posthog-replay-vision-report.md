# Replay vision setup report

## What is recording

The browser SDK (`posthog-js`) is installed and initialized in this Vite React app. It reads the configured public PostHog key and ingestion host from the environment, retains PostHog’s default autocapture behavior, and is ready to send baseline product activity.

Session recording is **not yet enabled at the PostHog project level**, so recordings will not flow until a project administrator enables **Record user sessions** in **Settings → Session replay**. No further client-code change is needed after that setting is enabled.

## Replay vision scanners

No scanners were created or updated in this run. The connected MCP credential lacks `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`, so it could not inventory existing scanners, estimate credits, check quota, or create monitors safely. The following configurations are prepared for an authorized follow-up:

### Padel booking failures

- **Type:** Monitor
- **Watches for:** A missing court; a time-slot selector that does not respond; a **Confirm booking** action that visibly fails or does nothing; or a missing booking confirmation.
- **Query scope:** Recordings limited to the booking and confirmation journey: `/book/:courtId` and `/confirmation`.
- **Estimated monthly credit spend:** Not available — an estimate could not be requested without the required scanner and session-recording access.

### Court booking frustration

- **Type:** Monitor
- **Watches for:** Clear signs a user got stuck or frustrated while booking: repeatedly trying to book a court, changing time slots and retrying **Confirm booking**, looking for confirmation, or trying to begin another booking.
- **Query scope:** Exactly rage-click recordings: `{"kind":"RecordingsQuery","events":[{"id":"$rageclick","type":"events"}]}`. No URL or additional-event filters are included.
- **Estimated monthly credit spend:** Not available — an estimate could not be requested without the required scanner and session-recording access.

### Padel booking session summaries

- **Type:** Summarizer
- **Watches for:** A concise two-to-three-sentence narrative of what the user tried to do, the main booking actions they took, and how the session ended, using the app’s padel-court, time-slot, and booking vocabulary.
- **Query scope:** All recordings (`{"kind":"RecordingsQuery"}`), sampled at **10%**.
- **Estimated monthly credit spend:** Not available — an estimate could not be requested without the required scanner and session-recording access.

## Follow-up needed

1. A project administrator must enable **Record user sessions** under **Settings → Session replay**.
2. Grant the MCP credential `product_enablement:write` if you want the integration to enable session replay directly in a future run.
3. Grant `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` so a follow-up can check for matching existing scanners, obtain credit estimates and quota, then create or update these prepared configurations without duplication.

## Where to look

After session recording is enabled and new sessions complete, results will appear on the **Replay vision** page in PostHog. The first scanner observations will arrive as eligible new recordings complete after the scanners are created.
