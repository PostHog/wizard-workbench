"""A chat service that forwards several raw LLM protocols without an SDK."""

import json
import os
from collections.abc import Sequence
from typing import Any

from aiohttp import ClientError, ClientSession, ClientTimeout, WSMsgType, web

from tools import lookup_order


CLIENT = web.AppKey("client", ClientSession)
OPENAI_BASE = web.AppKey("openai_base", str)
OLLAMA_BASE = web.AppKey("ollama_base", str)
USER_ID = web.RequestKey("user_id", str)
CONVERSATION_ID = web.RequestKey("conversation_id", str)

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "lookup_order",
            "description": "Look up the current user's latest order.",
            "parameters": {"type": "object", "properties": {}},
        },
    }
]


@web.middleware
async def resolve_user(request: web.Request, handler):
    """Treat headers as identity already resolved by this fixture's gateway."""
    user_id = request.headers.get("X-User-Id")
    conversation_id = request.headers.get("X-Conversation-Id")
    if not user_id or not conversation_id:
        raise web.HTTPUnauthorized(text="user and conversation required")
    request[USER_ID] = user_id
    request[CONVERSATION_ID] = conversation_id
    return await handler(request)


def provider_headers(openai: bool) -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    if openai and (api_key := os.environ.get("OPENAI_API_KEY")):
        headers["Authorization"] = f"Bearer {api_key}"
    return headers


async def forward(
    request: web.Request, base: str, default_stream: bool, openai: bool
) -> web.StreamResponse:
    """Forward one public inference route, including its native stream format."""
    raw = await request.read()
    try:
        payload = json.loads(raw)
    except (ValueError, UnicodeDecodeError) as exc:
        raise web.HTTPBadRequest(text="JSON request required") from exc
    if not isinstance(payload, dict):
        raise web.HTTPBadRequest(text="JSON object required")

    url = f"{base}{request.path}"
    try:
        async with request.app[CLIENT].post(
            url, data=raw, headers=provider_headers(openai)
        ) as upstream:
            content_type = upstream.headers.get("Content-Type", "application/json")
            response_headers = {"Content-Type": content_type}
            streamed = payload.get("stream", default_stream) is True
            if upstream.status >= 400 or not streamed:
                return web.Response(
                    status=upstream.status,
                    body=await upstream.read(),
                    headers=response_headers,
                )

            downstream = web.StreamResponse(
                status=upstream.status, headers=response_headers
            )
            await downstream.prepare(request)
            async for chunk in upstream.content.iter_chunked(4096):
                await downstream.write(chunk)
            await downstream.write_eof()
            return downstream
    except ClientError as exc:
        raise web.HTTPBadGateway(text="model provider unavailable") from exc


async def openai_chat(request: web.Request) -> web.StreamResponse:
    return await forward(request, request.app[OPENAI_BASE], False, True)


async def openai_responses(request: web.Request) -> web.StreamResponse:
    return await forward(request, request.app[OPENAI_BASE], False, True)


async def ollama_chat(request: web.Request) -> web.StreamResponse:
    return await forward(request, request.app[OLLAMA_BASE], True, False)


async def ollama_generate(request: web.Request) -> web.StreamResponse:
    return await forward(request, request.app[OLLAMA_BASE], True, False)


async def complete(
    request: web.Request, messages: Sequence[dict[str, Any]]
) -> dict[str, Any]:
    """Make the assistant's direct model call, separate from public proxy routes."""
    payload = {
        "model": "local-chat",
        "messages": list(messages),
        "tools": TOOLS,
        "stream": False,
    }
    try:
        async with request.app[CLIENT].post(
            f"{request.app[OPENAI_BASE]}/v1/chat/completions",
            json=payload,
            headers=provider_headers(True),
        ) as upstream:
            if upstream.status >= 400:
                raise web.HTTPBadGateway(text=f"model returned {upstream.status}")
            return await upstream.json()
    except ClientError as exc:
        raise web.HTTPBadGateway(text="model provider unavailable") from exc


async def assistant_ask(request: web.Request) -> web.Response:
    """Answer one turn, including the registered order tool when requested."""
    body = await request.json()
    question = body.get("question") if isinstance(body, dict) else None
    if not isinstance(question, str) or not question.strip():
        raise web.HTTPBadRequest(text="question required")

    messages: list[dict[str, Any]] = [
        {
            "role": "system",
            "content": "Answer briefly. Use lookup_order for order questions.",
        },
        {"role": "user", "content": question},
    ]
    first = await complete(request, messages)
    message = first["choices"][0]["message"]
    tool_calls = message.get("tool_calls", [])
    if tool_calls:
        messages.append(message | {"role": "assistant"})
        for call in tool_calls:
            if call["function"]["name"] != "lookup_order":
                raise web.HTTPBadGateway(text="unknown model tool")
            result = lookup_order(request[USER_ID])
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": call["id"],
                    "content": json.dumps(result),
                }
            )
        final = await complete(request, messages)
        message = final["choices"][0]["message"]

    return web.json_response({"answer": message.get("content") or ""})


async def websocket_generate(request: web.Request) -> web.WebSocketResponse:
    """Run native Ollama generation directly for each WebSocket message."""
    socket = web.WebSocketResponse()
    await socket.prepare(request)
    async for message in socket:
        if message.type != WSMsgType.TEXT:
            continue
        try:
            body = json.loads(message.data)
            prompt = body.get("prompt") if isinstance(body, dict) else None
        except ValueError:
            prompt = None
        if not isinstance(prompt, str) or not prompt.strip():
            await socket.send_json({"error": "prompt required"})
            continue

        payload = {"model": "local-ollama", "prompt": prompt, "stream": True}
        try:
            async with request.app[CLIENT].post(
                f"{request.app[OLLAMA_BASE]}/api/generate",
                json=payload,
                headers=provider_headers(False),
            ) as upstream:
                if upstream.status >= 400:
                    await socket.send_json(
                        {"error": "model provider failed", "status": upstream.status}
                    )
                    continue
                async for line in upstream.content:
                    if line.strip():
                        await socket.send_str(line.decode().strip())
        except ClientError:
            await socket.send_json({"error": "model provider unavailable"})
    return socket


async def start_client(app: web.Application) -> None:
    app[CLIENT] = ClientSession(timeout=ClientTimeout(total=120))


async def close_client(app: web.Application) -> None:
    await app[CLIENT].close()


def create_app(openai_base_url: str, ollama_base_url: str) -> web.Application:
    """Build the proxy for the two upstream provider bases."""
    app = web.Application(middlewares=[resolve_user])
    app[OPENAI_BASE] = openai_base_url.rstrip("/")
    app[OLLAMA_BASE] = ollama_base_url.rstrip("/")
    app.on_startup.append(start_client)
    app.on_cleanup.append(close_client)
    app.router.add_post("/v1/chat/completions", openai_chat)
    app.router.add_post("/v1/responses", openai_responses)
    app.router.add_post("/api/chat", ollama_chat)
    app.router.add_post("/api/generate", ollama_generate)
    app.router.add_post("/assistant/ask", assistant_ask)
    app.router.add_get("/ws/generate", websocket_generate)
    return app


if __name__ == "__main__":
    web.run_app(
        create_app(
            os.environ.get("OPENAI_BASE_URL", "http://127.0.0.1:8001"),
            os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434"),
        ),
        host="127.0.0.1",
        port=int(os.environ.get("PORT", "8000")),
        handler_cancellation=True,
    )
