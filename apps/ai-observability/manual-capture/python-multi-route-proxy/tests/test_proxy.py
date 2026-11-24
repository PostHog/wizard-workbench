"""Contract checks against a fake external model provider."""

import asyncio
import json
import unittest

from aiohttp import ClientSession, web

from app import create_app


async def serve(app: web.Application):
    runner = web.AppRunner(app, handler_cancellation=True)
    await runner.setup()
    site = web.TCPSite(runner, "127.0.0.1", 0)
    await site.start()
    port = site._server.sockets[0].getsockname()[1]
    return runner, f"http://127.0.0.1:{port}"


class ProxyContract(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.seen = []
        self.provider_cancelled = asyncio.Event()
        provider = web.Application()
        provider.router.add_post("/v1/chat/completions", self.chat)
        provider.router.add_post("/v1/responses", self.responses)
        provider.router.add_post("/api/chat", self.ollama)
        provider.router.add_post("/api/generate", self.ollama)
        self.provider_runner, provider_url = await serve(provider)
        self.proxy_runner, self.proxy_url = await serve(
            create_app(provider_url, provider_url)
        )
        self.client = ClientSession()

    async def asyncTearDown(self):
        await self.client.close()
        await self.proxy_runner.cleanup()
        await self.provider_runner.cleanup()

    async def chat(self, request):
        body = await request.json()
        self.seen.append((request.path, body))
        if body.get("fail"):
            return web.json_response({"error": "rate limited"}, status=429)
        if body.get("stream"):
            response = web.StreamResponse(headers={"Content-Type": "text/event-stream"})
            await response.prepare(request)
            await response.write(b'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n')
            await response.write(b"data: [DONE]\n\n")
            await response.write_eof()
            return response
        if body.get("tools") and not any(
            m.get("role") == "tool" for m in body["messages"]
        ):
            message = {
                "content": None,
                "tool_calls": [
                    {
                        "id": "call_1",
                        "function": {"name": "lookup_order", "arguments": "{}"},
                    }
                ],
            }
        else:
            message = {"content": "Order is shipped"}
        return web.json_response(
            {
                "choices": [{"message": message}],
                "usage": {"prompt_tokens": 11, "completion_tokens": 4},
            }
        )

    async def responses(self, request):
        body = await request.json()
        self.seen.append((request.path, body))
        if body.get("stream"):
            response = web.StreamResponse(headers={"Content-Type": "text/event-stream"})
            await response.prepare(request)
            await response.write(
                b'event: response.output_text.delta\ndata: {"type":"response.output_text.delta","delta":"Hello"}\n\n'
            )
            await response.write(
                b'event: response.completed\ndata: {"type":"response.completed","response":{"usage":{"input_tokens":7,"output_tokens":2}}}\n\n'
            )
            await response.write_eof()
            return response
        return web.json_response(
            {
                "output": [
                    {
                        "type": "message",
                        "content": [{"type": "output_text", "text": "Hello"}],
                    }
                ],
                "usage": {"input_tokens": 7, "output_tokens": 2},
            }
        )

    async def ollama(self, request):
        body = await request.json()
        self.seen.append((request.path, body))
        chunk = (
            {"response": "Hi"}
            if request.path == "/api/generate"
            else {"message": {"content": "Hi"}}
        )
        if body.get("stream", True):
            response = web.StreamResponse(
                headers={"Content-Type": "application/x-ndjson"}
            )
            await response.prepare(request)
            await response.write(json.dumps(chunk | {"done": False}).encode() + b"\n")
            if body.get("stall"):
                try:
                    await asyncio.sleep(5)
                except asyncio.CancelledError:
                    self.provider_cancelled.set()
                    raise
            await response.write(
                b'{"done":true,"prompt_eval_count":9,"eval_count":3}\n'
            )
            await response.write_eof()
            return response
        return web.json_response(
            chunk | {"done": True, "prompt_eval_count": 9, "eval_count": 3}
        )

    def headers(self):
        return {"X-User-Id": "user_123", "X-Conversation-Id": "thread_abc"}

    async def test_every_inference_route_preserves_its_response_mode(self):
        cases = [
            (
                "/v1/chat/completions",
                {"model": "local-chat", "messages": [], "stream": False},
                "application/json",
                b'"prompt_tokens": 11',
            ),
            (
                "/v1/chat/completions",
                {"model": "local-chat", "messages": [], "stream": True},
                "text/event-stream",
                b"data: [DONE]",
            ),
            (
                "/v1/responses",
                {"model": "local-response", "input": "Hi", "stream": False},
                "application/json",
                b'"input_tokens": 7',
            ),
            (
                "/v1/responses",
                {"model": "local-response", "input": "Hi", "stream": True},
                "text/event-stream",
                b"response.completed",
            ),
            (
                "/api/chat",
                {"model": "local-ollama", "messages": []},
                "application/x-ndjson",
                b'"prompt_eval_count":9',
            ),
            (
                "/api/generate",
                {"model": "local-ollama", "prompt": "Hi"},
                "application/x-ndjson",
                b'"eval_count":3',
            ),
            (
                "/api/chat",
                {"model": "local-ollama", "messages": [], "stream": False},
                "application/json",
                b'"prompt_eval_count": 9',
            ),
        ]
        for path, body, content_type, expected in cases:
            with self.subTest(path=path, stream=body.get("stream")):
                async with self.client.post(
                    self.proxy_url + path, json=body, headers=self.headers()
                ) as response:
                    self.assertEqual(response.status, 200)
                    self.assertEqual(response.content_type, content_type)
                    self.assertIn(expected, await response.read())
        self.assertEqual([path for path, _ in self.seen], [path for path, *_ in cases])

    async def test_provider_failure_is_forwarded(self):
        async with self.client.post(
            self.proxy_url + "/v1/chat/completions",
            json={"fail": True},
            headers=self.headers(),
        ) as response:
            self.assertEqual(response.status, 429)
            self.assertEqual(await response.json(), {"error": "rate limited"})

    async def test_assistant_executes_tool_between_two_model_calls(self):
        async with self.client.post(
            self.proxy_url + "/assistant/ask",
            json={"question": "Where is my order?"},
            headers=self.headers(),
        ) as response:
            self.assertEqual(response.status, 200)
            self.assertEqual(await response.json(), {"answer": "Order is shipped"})
        calls = [body for path, body in self.seen if path == "/v1/chat/completions"]
        self.assertEqual(len(calls), 2)
        self.assertEqual(calls[1]["messages"][-1]["role"], "tool")
        self.assertIn("shipped", calls[1]["messages"][-1]["content"])

    async def test_websocket_calls_native_generate_directly(self):
        async with self.client.ws_connect(
            self.proxy_url + "/ws/generate", headers=self.headers()
        ) as socket:
            await socket.send_json({"prompt": "Hi"})
            self.assertEqual(
                await socket.receive_json(), {"response": "Hi", "done": False}
            )
            self.assertEqual(
                await socket.receive_json(),
                {"done": True, "prompt_eval_count": 9, "eval_count": 3},
            )
        calls = [body for path, body in self.seen if path == "/api/generate"]
        self.assertEqual(
            calls, [{"model": "local-ollama", "prompt": "Hi", "stream": True}]
        )

    async def test_client_disconnect_cancels_upstream_stream(self):
        response = await self.client.post(
            self.proxy_url + "/api/generate",
            json={"model": "local-ollama", "prompt": "Hi", "stall": True},
            headers=self.headers(),
        )
        self.assertIn(b'"done": false', await response.content.readline())
        response.close()
        await asyncio.wait_for(self.provider_cancelled.wait(), timeout=1)


if __name__ == "__main__":
    unittest.main()
