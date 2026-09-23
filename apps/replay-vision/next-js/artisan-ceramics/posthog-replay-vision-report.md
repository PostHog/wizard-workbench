# Replay Vision Setup — Artisan Ceramics

## Recording status: not live yet, one manual step away

The app-side blocker is fixed: `instrumentation-client.ts` had `disable_session_recording: true` hard-coded (left over from cookie-banner work), which was silently preventing any recording regardless of project settings. That line has been removed, so the app itself no longer blocks recording.

However, the **project-level "Record user sessions" setting could not be turned on** — the PostHog MCP connection used for this run is missing the `product_enablement:write` scope, so the enable call was rejected outright.

**Follow-up needed from you:** turn on session replay manually in [Settings → Session replay](https://us.posthog.com/project/483112/settings/environment-replay), or reconnect the PostHog MCP integration with the missing scope and re-run enablement. Until then, no sessions will record even though the code is ready.

## Scanners: none created — MCP connection is under-scoped

All three scanner tasks (broken-experiences monitor, user-frustration monitor, session-summaries) hit the same wall: this run's PostHog MCP connection is missing `replay_scanner:read`/`replay_scanner:write` (and in two cases the create/update tools weren't exposed at all). No PostHog writes were attempted — nothing exists in PostHog for any of these yet.

Each scanner was fully scoped against the actual app (a small ceramics storefront: browse → add to cart → checkout with email/card → confirmation) so creation can happen immediately once access is restored:

| Scanner | Type | Watches | Query scope | Sampling | Est. spend |
|---|---|---|---|---|---|
| **Order checkout breakage** | monitor | Broken moments: "Place order" doing nothing, a valid card getting rejected, no confirmation after checkout, cart not updating after "Add to cart" | Sessions touching `/cart` or `/checkout` (icontains match, also covers `/checkout/success`) | 0.5 | Not sized — `vision-scanners-estimate-create` is scope-gated, so no credit estimate could be run |
| **Order frustration** | monitor | Rage-clicks and stuck moments: hammering "Add to cart" with no visible change, repeated blocked form submits, repeated "Payment declined" retries, no way to edit/remove a cart item | `$rageclick` events only, no URL filter (deliberately non-overlapping with the breakage monitor) | 1.0 | Not sized — same scope block |
| **Ceramics shopper session summaries** | summarizer | Plain-language recap of what each shopper did (browsing, cart, checkout, purchase) | All sessions, unscoped | 0.1 | Not sized — same scope block |

**Follow-up needed from you:** reconnect/reauthorize the PostHog MCP connection with `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` (and confirm the `vision-scanners-create`/`update` tools are exposed). Then, in order: check `vision-scanners-list` for any accidental duplicates, run the size-before-you-ship estimate for each, and create the three scanners above using the locked prompt scaffolds already filled in by the earlier tasks.

## SDK status

PostHog was already installed and initialized in this app before this run (token, host, and `posthog.init()` in `instrumentation-client.ts` were already in place) — this run did not need to install or initialize the SDK, only unblock the recording config.

## Where results will appear

Once recording is turned on and the scanners are created, everything surfaces on the **Replay vision** page in PostHog. The first observations appear as new recordings complete and get scanned — there's nothing to see yet because recording itself isn't live.
