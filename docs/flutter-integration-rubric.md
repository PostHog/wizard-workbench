# Flutter integration rubric

Scored against the diff a wizard run produces on a real Flutter app. Every item is
mechanically checkable — a grep, a diff, or a command exit code — so a run either
passes or it does not, with no judgement call about intent.

`n/a` is only allowed where the app genuinely lacks the surface (no auth, no web
target). An item that applies and is absent is a fail, not a partial.

## Blocking — the integration is broken without these

| # | Item | Check |
|---|---|---|
| B1 | SDK declared | `posthog_flutter` in `pubspec.yaml` with a caret constraint |
| B2 | Dependencies resolve | `flutter pub get` exits 0 |
| B3 | Analyzer clean | `flutter analyze` reports 0 issues, including the project's own lints |
| B4 | Dart init runs before the app | `WidgetsFlutterBinding.ensureInitialized()` then `await setup...()` ahead of `runApp` |
| B5 | Native auto-init disabled | `com.posthog.posthog.AUTO_INIT=false` in every shipped native target's manifest/plist |
| B6 | Screen tracking wired | `PosthogObserver()` present in `navigatorObservers` |
| B7 | Web target initialized | if `web/index.html` exists, it contains the posthog-js snippet |
| B9 | Web init is self-contained | the snippet does not depend on a global nothing defines — it must work from the built output alone |
| B8 | Events captured | at least one `Posthog().capture` on a real user action |

## Quality — the integration works but a reviewer would object

| # | Item | Check |
|---|---|---|
| Q1 | No guard duplication | count of init-predicate guards at capture sites is 0 |
| Q2 | No new dependencies | `posthog_flutter` is the only added dependency |
| Q3 | Idiomatic config | `String.fromEnvironment`, no dotenv package, no hardcoded token |
| Q4 | Error tracking configured | `captureFlutterErrors` + `inAppIncludes` naming this app's package |
| Q5 | Events are product-meaningful | domain verbs with useful properties, not `button_clicked` |
| Q6 | Identify/reset | present iff the app has authentication |
| Q7 | Minimal diff | no file touched that the integration did not need |
| Q8 | Conventions followed | matches the project's existing file layout and naming |

## Fix constraints — how the fix itself is judged

The point is not only that a run passes. The change that makes it pass must be:

- **Minimal** — the smallest edit that moves the behavior, not a checklist bolted
  into every step description.
- **Structural, not hardcoded** — states the rule; lets the variant's own docs and
  example supply `PosthogObserver`, `web/index.html`, and the rest. A fix that
  names Flutter specifics in shared prose is a hack, however well it scores.
- **Load-bearing** — removing it makes the run fail again. Prose that reads well
  but changes nothing is worse than no prose, because it looks like coverage.
- **Generalizing** — the same wording should help Swift, Android, KMP, and React
  Native, which share these step descriptions.

## Scoring

A run passes when every applicable blocking item passes. Quality items are
reported per run to catch regressions between iterations.

## Log

| Run | B1 | B4 | B5 | B6 | B7 | B8 | Q1 | Verdict | Change under test |
|-----|----|----|----|----|----|----|----|---------|-------------------|
| base | P | P | P | F | F | P | F(7) | FAIL | none — released skills |
| iter0 | P | P | P | F | F | P | P | FAIL | capture + init step prose |
| iter0b | P | P | P | **P** | F | P | P | FAIL | same prose, re-run — observer appeared |
| iter1 | P | P | P | F | F | P | P | FAIL | + explicit example README — observer vanished again |
| iter2 | P | P | P | F | P* | P | P | FAIL | commandments framed as obligations (1 line) |

`*` iter2's B7 passes the letter and fails B9: it injects a loader reading
`window.POSTHOG_PROJECT_TOKEN`, a global nothing sets, so web still captures
nothing. First time web was touched at all, though.

| iter3 | P | P | P | F | F | P | P | FAIL | init owns automatic-capture registration (reverted, no effect) |
| iter4 | P | P | P | F | P* | P | P | FAIL | verify step re-checks framework rules |
| iter5 | P | P | P | F | F | P | P | FAIL | token carve-out widened + observer escape hatch removed |
| iter6 | P | P | P | **P** | F | P | P | FAIL | docs: `## Complete setup` block, observer "whatever routing package" |
| iter7 | P | P | P | P | F | P | P | FAIL | init:7 public-token-vs-secret |
| iter8 | P | P | P | P | F | P | P | FAIL | docs: refute deploy-time-injection objection |
| iter9 | P | P | P | **P** | **P** | P | P | **PASS** | commandment: real token inline, example placeholder is not the shape to copy |

**iter9 is the first full blocking pass**, and B9 passes with it — the snippet
carries the real token (`phc_a1NM…`) with zero undefined globals.

**What actually fixed each gap**

- **B6** — the docs framed `PosthogObserver` as one option for two named routing
  mechanisms, and gated it behind "your routes should be named". LocalSend uses
  `routerino`, which is neither of the two and names routes internally where the
  agent cannot see it. Saying the observer attaches whatever the routing package is
  fixed it: 4 consecutive passes after 1-in-7 before.
- **B7** — never an information gap. The agent refused on security grounds, wanting
  "secure build-time injection" for a token that is public. Three sources had to
  agree before it moved: the token is meant to ship, no deploy-time injection
  exists, and the example's `phc_your_project_token_here` is a placeholder for
  readers rather than the shape to copy. That last point is the one that landed —
  the agent was faithfully imitating an example that captures nothing.

**B9 root cause, corrected.** The agent invents `window.POSTHOG_PROJECT_TOKEN`
because `init/description.md:7` says keys go through `set_env_values`, "never
hardcoded" — an absolute rule that contradicts the example, whose snippet reads
`posthog.init("phc_your_project_token_here", ...)`. Inside a static HTML asset
there is no env to read, so the agent invents a global rather than break the rule.
The right distinction is public token vs secret, not env vs hardcoded: a public
project token belongs inline in whatever ships; a secret never ships.

**Control run settles it.** The same iter5 skills against a plain `flutter create`
app wired `PosthogObserver` on the first try, while LocalSend managed it once in
seven. Web failed on both. So the two gaps have different causes:

- **B6 is app-dependent.** LocalSend routes through `routerino`; the agent does not
  connect a custom routing package to `navigatorObservers`. General prose cannot fix
  a recognition failure about one app's router — the doc has to say the observer
  attaches whatever the routing package is.
- **B7 is universal.** Missing on every app, 2 of 9 runs. A genuine guidance gap,
  and the one the amended doc targets.

Tuning a single knob against both was why nothing held.

**Variance is the headline finding.** iter0 and iter0b are the same configuration
with opposite results on B6. Any single run is one sample; a fix is only load-bearing
if it holds across repeated runs, so each candidate needs at least two.

## Result

**Passing set: 3/3 on LocalSend, 1/1 on the plain control (`flutter pub get` +
`flutter analyze` clean). Five prose changes, no code.**

| # | Where | What it corrects |
|---|-------|------------------|
| 1 | docs `libraries/flutter` | `## Complete setup` block: the four required steps, each silent when missing; observer attaches whatever the routing package is; web needs no build- or deploy-time injection |
| 2 | `commandments.yaml` flutter web | write the configured token in as a literal; the example's `phc_your_project_token_here` is a placeholder for readers, not the shape to copy |
| 3 | `commandments.yaml` flutter screens | observer goes on `navigatorObservers` whatever the router; unnamed routes are a thing to fix, not a reason to skip |
| 4 | `init/description.md` | public token is meant to ship; inventing an injection step or leaving a global captures nothing |
| 5 | `skill-generator.js` | framework rules are obligations to check before finishing, not background advice |

## Minimality

Two removal tests, one run each, both failed:

- docs + web commandment only → B6 fail, B7 fail
- \+ obligations header + public-token rule → B6 fail, B7 fail

So the set is not trivially reducible. With one trial per subset this is suggestive,
not conclusive — the workload has produced opposite results from identical inputs
before, so separating "required" from "bad run" needs 3-5 runs per subset.

## Caveats

- `Q4` (error tracking `inAppIncludes`) still varies run to run; it is a quality
  item, not blocking.
- The harness rsyncs only the app directory, so a pub-workspace project's copy
  cannot build: `flutter pub get` and `flutter analyze` exit 66 on LocalSend. The
  agent cannot self-verify there. B2/B3 were checked on the control app instead.
