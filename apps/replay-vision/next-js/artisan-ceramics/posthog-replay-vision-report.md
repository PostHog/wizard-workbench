# Replay vision report

> ⚠️ **Needs your attention**
> - A project administrator must enable **Record user sessions** in **Settings → Session replay**. The browser SDK is configured to allow recording, but new recordings will not arrive until this project-level setting is enabled.
> - To create the prepared Replay vision scanners, use an MCP credential with `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`. The current credential could not inspect scanner inventory, estimate credits, check quota, or create scanners.

## What is recording

The existing browser PostHog SDK initialization has been updated so it no longer disables session recording. PostHog was already initialized in the app; this run did not install a new SDK. Once **Record user sessions** is enabled by an administrator, new browser sessions can be recorded.

## Replay vision scanners

No scanners were created or updated in this run because the connected credential lacks the required Replay Vision permissions. As a result, **estimated monthly credit spend is not available** for any scanner: estimates and the organization budget could not be read safely.

### Checkout failures

- **Status:** Prepared; deferred
- **What it watches:** Payment-declined messages, unsuccessful order placement, missing order confirmation, and checkout forms that do not complete.
- **Query scope:** Recordings whose `$current_url` contains `/checkout`, covering checkout and the checkout success path.
- **Planned configuration:** Monitor scanner, `0.5` sampling rate, `gemini-3-flash-preview`.
- **Estimated monthly credits:** Not available — required scanner estimate and quota access is unavailable.

### Artisan Ceramics checkout frustration

- **Status:** Prepared; deferred
- **What it watches:** Clear signs that shoppers get stuck or frustrated while adding products, moving from cart to checkout, entering details, retrying after a declined payment, or trying to reach order confirmation.
- **Query scope:** Only recordings containing the `$rageclick` event.
- **Planned configuration:** Monitor scanner, `1.0` sampling rate, `gemini-3-flash-preview`.
- **Estimated monthly credits:** Not available — required scanner estimate and quota access is unavailable.

### Artisan Ceramics session summaries

- **Status:** Prepared; deferred
- **What it watches:** A session-level summary of browsing products, adding items to the cart, checking out, and placing orders.
- **Query scope:** Unscoped `RecordingsQuery`, so it can summarize eligible recorded sessions across the storefront.
- **Planned configuration:** Summarizer scanner, `0.1` sampling rate, `gemini-3-flash-preview`.
- **Estimated monthly credits:** Not available — required scanner estimate and quota access is unavailable.

## Next steps and where to look

After session recording is enabled and the required scanner permissions are available, first inspect existing scanners, estimate each prepared scanner's monthly credits, compare the estimates with the remaining monthly budget, and then create or update only the matching configurations.

Results will appear on the [Replay vision page](https://us.posthog.com/project/483112/replay-vision) in PostHog. The first observations will arrive as new session recordings complete after recording is enabled and scanners are created.
