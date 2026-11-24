# Scenario manifests

One file per error-tracking fixture, `<app>.json`, named after the app
directory. This directory sits outside every app, so the wizard's agent never
sees the expectations: `run.sh` copies only files inside the app, and the app
finders skip hidden directories.

A manifest says how to build and start the app, how to trigger each error, and
what PostHog must receive for it. The QA scripts that read it
(`exercise.mjs`, `verify.mjs`) live in the `make-framework-great-again` skill.

```json
{
  "app": "no-posthog-next-16-app",
  "lifecycle": {
    "install": { "argv": ["npm", "ci"] },
    "build": { "argv": ["npm", "run", "build"] },
    "start": { "argv": ["npm", "run", "start", "--", "-p", "{port}"], "ready": { "path": "/", "timeoutMs": 60000 } },
    "env": {},
    "flushWaitMs": 15000
  },
  "scenarios": [
    {
      "id": "route-handler-headers",
      "surface": "Route Handler throws, request with X-POSTHOG-* tracing headers",
      "requirement": "CTX-1",
      "trigger": { "kind": "http", "path": "/api/invoices/INV-5150/pdf", "identity": "headers", "expectStatus": 500 },
      "throws": { "match": "PD50", "file": "lib/invoices.ts" },
      "expect": { "count": 1, "lib": "posthog-node", "linked": true, "request": true,
                  "topFrame": { "resolved": true, "sourceEndsWith": "lib/invoices.ts" } }
    }
  ]
}
```

## Fields

- `extends`: a base manifest in this directory (files starting with `_`).
  `overrides` (scenario id → fields merged into that scenario), `remove`
  (ids) and `add` (scenarios) adjust it; objects merge, other values replace,
  `null` deletes a field. `knownNoise` lists from both are joined.
- `lifecycle`: commands run in the app copy with a clean environment (`PATH`,
  `HOME`, `CI=true`, `PORT`) plus `env`; `{port}` and `{base}` are
  substituted. `flushWaitMs` keeps the server up after the last trigger so
  server SDKs flush.
  - `start.script`: the app's npm script to run (`start`), with
    `scriptArgs`; `start.argv` is used only when the app has no such script.
    `start.envFiles` are read by the harness and passed as process
    environment, as a host injects variables; `start.env` wins over them.
  - `checks`: build-time requirements, recorded without stopping the run:
    `{ "name", "argv" }` runs a command in the app; `"withoutEnvFiles": true`
    runs it in a copy without `.env*` files (a fresh checkout);
    `{ "name", "assertAbsent": ["build/client/**/*.map"] }` fails when a
    matching file exists after the build.
- `trigger.kind`:
  - `http`: `method`, `path`, `body`, `headers`, `expectStatus`,
    `timeoutMs`, `expectAbort` (the client gives up after `timeoutMs`, as a
    visitor leaving does), and `identity`: `headers` (synthetic
    `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID`), `headers+cookie`
    (the headers plus a cookie for another visitor; the headers must win),
    `cookie` (the project's `ph_<token>_posthog` cookie for an anonymous
    visitor), `cookie-identified` (the cookie for an identified user),
    `cookie-opted-out` (the cookie plus the consent cookie set to opt out), or
    `none`. `foreignCookie: true` puts another project's PostHog cookie
    first. Every request carries `X-Forwarded-For: 203.0.113.77`.
  - `browser`: `page`, `actions` (`{click}`, `{fill: {selector, value}}`,
    `{goto}`, `{evaluate}`, `{wait}`), `waitMs`, `expectText` or
    `expectPageError`. The identity is read from posthog-js's cookie or
    localStorage.
  - `process`: `argv`, `env`, `expectExit`.
  - `gapMs` on any trigger: pause after it (default 1.5 s).
- `fresh: true` on a scenario: run it on a newly started server, so no
  earlier scenario warmed the process (a lazily created client).
- `throws.match`: a substring of the error message, unique across the fixture.
  `throws.urlMatch`: a page or request path, for negatives where nothing is
  thrown (a 404 page). `throws.file`: where the code throws.
- `expect`: `count` (0 for errors that must not be captured), `lib` (`$lib`
  prefix), `linked` (distinct ID and session ID equal the trigger's identity),
  `visitor: false` (no identity, session or user agent of the visitor),
  `request` (`true`: URL properties present; `{ "path", "method" }`: the
  page path in `$current_url` and `$request_path`, and `$request_method`;
  a `.data` path always fails), `release`, `topFrame` (`resolved`,
  `sourceEndsWith`, compared without a module query such as
  `?route-chunk=`), `handled`, `level`.
- `knownNoise`: `[{ "match", "lib", "reason" }]`. The verifier fails on every
  `$exception` in the run that no scenario claims, unless its type or message
  contains `match`; those are listed with the reason (a known SDK gap).

Expectations encode the error-tracking instrumentation standard, not what the
wizard does today. Fixture code never names them: errors carry opaque codes
(`PD50`), and the manifest maps each code to the surface it tests.
