# wb-aio-manual-python-multi-route-proxy

An aiohttp chat gateway forwards raw provider HTTP responses. It has no vendor
LLM SDK and no PostHog code. The Wizard must use manual AI capture without
changing the proxy's request or response behavior.

The gateway supplies `X-User-Id` and `X-Conversation-Id` on every request. A
conversation can make several requests. Each request or WebSocket message is
one trace in that conversation. These headers stand in for identity resolved by
an upstream gateway. They are not provider credentials.

## Inference paths

| Entry point | Upstream call | Response shape | Capture target |
| --- | --- | --- | --- |
| `POST /v1/chat/completions` | OpenAI-compatible `/v1/chat/completions` | JSON or SSE | One generation per request |
| `POST /v1/responses` | OpenAI Responses `/v1/responses` | JSON or SSE | One generation per request |
| `POST /api/chat` | Ollama native `/api/chat` | JSON or NDJSON, streaming by default | One generation per request |
| `POST /api/generate` | Ollama native `/api/generate` | JSON or NDJSON, streaming by default | One generation per request |
| `POST /assistant/ask` | Direct OpenAI-compatible calls in `complete()` | Two JSON calls when the order tool runs | Two generations and one tool span |
| `GET /ws/generate` | Direct Ollama `/api/generate` for each WebSocket message | NDJSON relayed as WebSocket frames | One generation per message |

The two direct paths bypass the four HTTP proxy handlers. Instrumenting only
`forward()` leaves them dark. Instrumenting only `complete()` leaves the public
proxy routes dark.

## Expected outcome

- **Coverage.** Every path in the table emits its capture target. A successful
  stream emits once when it finishes, not once per chunk. A WebSocket with two
  prompt messages emits two generations.
- **Grouping.** Each request or WebSocket message gets a new `$ai_trace_id`.
  Calls and the `lookup_order` span within one `/assistant/ask` share that ID.
  `$ai_session_id` equals `X-Conversation-Id` across related traces, and the
  event `distinct_id` equals `X-User-Id`.
- **Tool flow.** An order question produces `generation → span(lookup_order) →
  generation`. The span uses `$ai_parent_id` and records the actual tool
  execution, not the mere presence of a tool schema in the model request.
- **Provider formats.** OpenAI-compatible chat usage maps `prompt_tokens` and
  `completion_tokens`. OpenAI Responses JSON and `response.completed` SSE map
  `input_tokens` and `output_tokens`, with text from `response.output_text.delta`
  on streams. Ollama's final JSON or NDJSON object maps top-level
  `prompt_eval_count` and `eval_count`. Missing usage stays unknown, not zero.
- **Failures.** A provider HTTP error or connection failure produces an errored
  generation with `$ai_is_error` and a safe `$ai_error`. An interrupted SSE,
  NDJSON, or WebSocket stream is marked incomplete or errored. No partial stream
  is reported as a successful completed generation.
- **Behavior.** HTTP status, body, content type, stream order, and cancellation
  still reach the caller. The order tool still runs between its two model calls.

Fail the evaluation if any listed inference path is missing, token counts use
another provider's field names, a stream is captured before its final outcome,
an error is labeled successful, or the tool span has a separate trace.

## Run locally

Install `requirements.txt`, then point `OPENAI_BASE_URL` and `OLLAMA_BASE_URL`
at compatible servers. `OPENAI_API_KEY` is optional for local compatible
servers. The app binds to `127.0.0.1:8000` by default.

```bash
python -m pip install -r requirements.txt
python app.py
```

The contract test uses a fake provider, so it needs no credentials or model:

```bash
python -m unittest discover -s tests -v
```

Run the Wizard evaluation from the workbench root:

```bash
pnpm wizard-ci --app ai-observability/manual-capture/python-multi-route-proxy --evaluate --local
```
