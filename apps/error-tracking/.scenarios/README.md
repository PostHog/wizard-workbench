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

- `lifecycle`: commands run in the app copy with a clean environment (`PATH`,
  `HOME`, `CI=true`, `PORT`) plus `env`; `{port}` and `{base}` are
  substituted. `flushWaitMs` keeps the server up after the last trigger so
  server SDKs flush.
- `trigger.kind`:
  - `http`: `method`, `path`, `body`, `headers`, `expectStatus`, and
    `identity`: `headers` (synthetic `X-POSTHOG-DISTINCT-ID` and
    `X-POSTHOG-SESSION-ID`), `cookie` (a fresh `ph_<token>_posthog` cookie with
    the same synthetic identity), or `none`.
  - `browser`: `page`, `actions` (`{click}`, `{fill: {selector, value}}`,
    `{goto}`, `{evaluate}`, `{wait}`), `waitMs`, `expectText` or
    `expectPageError`. The identity is read from posthog-js's cookie or
    localStorage.
  - `process`: `argv`, `env`, `expectExit`.
  - `gapMs` on any trigger: pause after it (default 1.5 s).
- `throws.match`: a substring of the error message, unique across the fixture.
  `throws.urlMatch`: a page or request path, for negatives where nothing is
  thrown (a 404 page). `throws.file`: where the code throws.
- `expect`: `count` (0 for errors that must not be captured), `lib` (`$lib`
  prefix), `linked` (distinct ID and session ID equal the trigger's identity),
  `request` (`$current_url`, `$request_path` or `$pathname` present),
  `release`, `topFrame` (`resolved`, `sourceEndsWith`), `handled`, `level`.

Expectations encode the error-tracking instrumentation standard, not what the
wizard does today. Fixture code never names them: errors carry opaque codes
(`PD50`), and the manifest maps each code to the surface it tests.
