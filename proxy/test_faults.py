import importlib.util
import json
import os
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import patch

HERE = Path(__file__).parent

# The matcher is exercised without importing mitmproxy's bundled interpreter.
mitmproxy = types.ModuleType('mitmproxy')
mitmproxy.http = types.SimpleNamespace(Response=types.SimpleNamespace(make=lambda status, body, headers: types.SimpleNamespace(status_code=status, content=body, headers=headers)))
sys.modules['mitmproxy'] = mitmproxy
spec = importlib.util.spec_from_file_location('faults', HERE / 'faults.py')
faults = importlib.util.module_from_spec(spec)
spec.loader.exec_module(faults)

class Request:
    def __init__(self, host='ai-gateway.us.posthog.com', path='/v1/messages', method='POST'):
        self.host, self.path, self.method = host, path, method

class Flow:
    def __init__(self, request):
        self.request = request
        self.response = None
        self.metadata = {}

class FaultsTest(unittest.TestCase):
    def addon(self, scenario='http_401'):
        with patch.dict(os.environ, {'WIZARD_PROXY_SCENARIO': scenario}):
            return faults.Faults(HERE / 'scenarios.json')

    def test_off_passes_through(self):
        flow = Flow(Request())
        self.addon('').request(flow)
        self.assertIsNone(flow.response)
        flow.response = types.SimpleNamespace(status_code=204, headers={})
        self.addon('').response(flow)
        self.assertNotIn('X-Wizard-Fault', flow.response.headers)

    def test_exact_gateway_scope_and_one_shot(self):
        addon = self.addon()
        for request in (Request('other.example'), Request(path='/v1/messages/count_tokens'), Request(method='GET')):
            flow = Flow(request)
            addon.request(flow)
            self.assertIsNone(flow.response)
        first, second = Flow(Request()), Flow(Request())
        addon.request(first)
        addon.request(second)
        self.assertEqual(first.response.status_code, 401)
        self.assertEqual(first.response.headers['X-Wizard-Fault'], 'http_401')
        self.assertIsNone(second.response)

    def test_both_harness_routes_and_local_gateway(self):
        for host, path in [('ai-gateway.eu.posthog.com', '/v1/messages'), ('ai-gateway.us.posthog.com', '/v1/responses'), ('ai-gateway.us.posthog.com', '/v1/chat/completions'), ('localhost', '/wizard/v1/responses'), ('127.0.0.1', '/wizard/v1/messages')]:
            with self.subTest(host=host, path=path):
                flow = Flow(Request(host, path))
                self.addon().request(flow)
                self.assertEqual(flow.response.status_code, 401)

    def test_scenarios(self):
        for name, status in [('http_400', 400), ('http_401', 401), ('http_429', 429), ('http_503', 503), ('malformed', 200), ('truncated', 200), ('midstream', 200)]:
            with self.subTest(name=name):
                flow = Flow(Request())
                self.addon(name).request(flow)
                self.assertEqual(flow.response.status_code, status)

    def test_invalid_scenario_fails_closed(self):
        with self.assertRaises(ValueError):
            self.addon('missing')

if __name__ == '__main__':
    unittest.main()
