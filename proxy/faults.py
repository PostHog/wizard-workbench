"""Opt-in, exact-route fault injection for Wizard gateway requests.

Only WIZARD_PROXY_SCENARIO enables a scenario. Never inspect or log request
headers, query strings, bodies, response bodies, or credential values.
"""
import json
import os
from pathlib import Path

from mitmproxy import http


CONFIG = Path(__file__).with_name("scenarios.json")


class Faults:
    def __init__(self, config_path=CONFIG):
        config = json.loads(Path(config_path).read_text())
        self.routes = {
            (route["host"], path)
            for route in config["routes"]
            for path in route["paths"]
        }
        self.name = os.environ.get("WIZARD_PROXY_SCENARIO", "")
        if self.name and self.name not in config["scenarios"]:
            raise ValueError("Unknown WIZARD_PROXY_SCENARIO; see proxy/scenarios.json")
        self.scenario = config["scenarios"].get(self.name)
        self.hits = 0

    def request(self, flow):
        request = flow.request
        path = request.path.split("?", 1)[0]
        if request.method != "POST" or (request.host, path) not in self.routes:
            return
        self.hits += 1
        if not self.scenario or self.hits > self.scenario["max_hits"]:
            # The response hook reports the upstream status for scoped traffic.
            flow.metadata["wizard_fault_path"] = path
            return
        status = self.scenario["status"]
        kind = self.scenario["kind"]
        is_anthropic = path.endswith("/messages")
        headers = {"cache-control": "no-store", "X-Wizard-Fault": self.name}
        if kind == "http":
            error_type = {400: "invalid_request_error", 401: "authentication_error", 429: "rate_limit_error", 503: "api_error"}[status]
            if is_anthropic:
                body = {"type": "error", "error": {"type": error_type, "message": "Synthetic Wizard proxy fault"}}
            else:
                body = {"error": {"type": error_type, "message": "Synthetic Wizard proxy fault", "code": error_type}}
            payload = json.dumps(body).encode()
            headers["content-type"] = "application/json"
        elif kind == "malformed":
            payload = b'{"incomplete":'
            headers["content-type"] = "application/json"
        elif kind == "truncated":
            payload = (b'event: message_start\ndata: {"type":"message_start","message":'
                       if is_anthropic else b'data: {"id":"synthetic","object":')
            headers["content-type"] = "text/event-stream"
        elif kind == "midstream":
            # A valid opening frame followed by a provider-shaped error frame.
            # No terminal success frame is sent.
            if is_anthropic:
                payload = (b'event: message_start\ndata: {"type":"message_start","message":{"id":"synthetic","type":"message","role":"assistant","content":[]}}\n\n'
                           b'event: error\ndata: {"type":"error","error":{"type":"api_error","message":"Synthetic Wizard proxy midstream fault"}}\n\n')
            elif path.endswith("/chat/completions"):
                payload = (b'data: {"id":"synthetic","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"}}]}\n\n'
                           b'data: {"error":{"type":"api_error","message":"Synthetic Wizard proxy midstream fault"}}\n\n')
            else:
                payload = (b'data: {"type":"response.created","response":{"id":"synthetic","status":"in_progress"}}\n\n'
                           b'data: {"type":"error","error":{"type":"api_error","message":"Synthetic Wizard proxy midstream fault"}}\n\n')
            headers["content-type"] = "text/event-stream"
        flow.response = http.Response.make(status, payload, headers)
        print(f"wizard-fault scenario={self.name} status={status} path={path} hit={self.hits}", flush=True)

    def response(self, flow):
        path = flow.metadata.get("wizard_fault_path")
        if path:
            print(f"wizard-fault scenario=pass-through status={flow.response.status_code} path={path} hit={self.hits}", flush=True)


addons = [Faults()]
