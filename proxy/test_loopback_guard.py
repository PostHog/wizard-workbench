import importlib.util
from pathlib import Path
import sys
import types
import unittest


HERE = Path(__file__).parent
mitmproxy = types.ModuleType('mitmproxy')
mitmproxy.http = types.SimpleNamespace(
    Response=types.SimpleNamespace(
        make=lambda status, body, headers: types.SimpleNamespace(
            status_code=status, content=body, headers=headers)))
sys.modules['mitmproxy'] = mitmproxy
spec = importlib.util.spec_from_file_location('loopback_guard', HERE / 'loopback_guard.py')
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class LoopbackGuardTest(unittest.TestCase):
    def test_external_https_connect_is_denied_before_upstream(self):
        flow = types.SimpleNamespace(
            request=types.SimpleNamespace(host='probe.invalid'), response=None)
        guard.LoopbackGuard().http_connect(flow)
        self.assertEqual(flow.response.status_code, 421)

    def test_loopback_https_connect_is_allowed(self):
        flow = types.SimpleNamespace(
            request=types.SimpleNamespace(host='127.0.0.1'), response=None)
        guard.LoopbackGuard().http_connect(flow)
        self.assertIsNone(flow.response)

    def test_external_request_is_answered_without_upstream(self):
        flow = types.SimpleNamespace(
            request=types.SimpleNamespace(host='internal-j.posthog.com'),
            response=None,
        )
        guard.LoopbackGuard().request(flow)
        self.assertEqual(flow.response.status_code, 421)

    def test_loopback_request_is_left_for_the_fake_gateway(self):
        for host in ('127.0.0.1', 'localhost'):
            with self.subTest(host=host):
                flow = types.SimpleNamespace(
                    request=types.SimpleNamespace(host=host), response=None)
                guard.LoopbackGuard().request(flow)
                self.assertIsNone(flow.response)


if __name__ == '__main__':
    unittest.main()
