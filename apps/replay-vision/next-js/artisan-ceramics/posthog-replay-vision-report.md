# Replay Vision setup report

> ⚠️ **Needs your attention**
> - A project administrator must enable **Record user sessions** in **Settings → Session replay** before browser recordings begin flowing.
> - To create or update the planned Replay Vision scanners, grant this connection `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`, then rerun the scanner steps.

## Recording status

The browser SDK no longer disables session recording in code, so it is ready to record sessions using PostHog’s default behavior. Recordings will begin only after an administrator enables **Record user sessions** in the project’s Session replay settings. No additional client-code change is needed.

This run did not install or initialize the SDK; it updated the existing client initialization so it no longer opts out of replay recording.

## Replay Vision scanners

No scanners were created or updated because the available connection lacks the required Replay Vision and session-recording permissions. Their monthly credit estimates and remaining quota could therefore not be retrieved or validated.

| Scanner | What it watches | Query scope | Estimated monthly credit spend | Status |
| --- | --- | --- | --- | --- |
| **Checkout failures** | Visible checkout breakage: payment-declined messages, checkout fields or **Place order** failing, or no order confirmation after submission. | Recordings whose `$current_url` contains `/cart` or `/checkout`; monitor sampling rate `0.5`; model `gemini-3-flash-preview`. | **Not available** — requires scanner estimate and quota access. | Deferred pending permissions. |
| **Ceramics checkout frustration** | Clear signs a shopper is stuck or frustrated while adding to cart, finding/continuing to checkout, retrying payment, or repeatedly entering card details. | `$rageclick`-only recordings; monitor sampling rate `1.0`; comprehensive analysis; model `gemini-3-flash-preview`. | **Not available** — requires scanner estimate and quota access. | Deferred pending permissions. |
| **Ceramics shopper session summaries** | Summaries of browsing ceramics, adding mugs/bowls/vases to cart, proceeding through checkout, and ordering. | Unscoped recordings query; summarizer sampling rate `0.1`; model `gemini-3-flash-preview`. | **Not available** — requires scanner estimate and quota access. | Deferred pending permissions. |

## Follow-up

After permissions are granted, rerun the scanner steps. They will first check for an existing matching scanner, calculate the exact monthly credit estimate, verify quota, and then create or update the scanner as appropriate.

Once session recording is enabled and new recordings complete, Replay Vision results will appear on the **Replay vision** page in PostHog. That is the first place to look for observations.
