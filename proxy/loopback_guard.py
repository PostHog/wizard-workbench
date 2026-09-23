"""Restrict the synthetic fault probe to loopback upstream requests."""

from mitmproxy import http


class LoopbackGuard:
    def http_connect(self, flow):
        self._block_non_loopback(flow)

    def request(self, flow):
        self._block_non_loopback(flow)

    @staticmethod
    def _block_non_loopback(flow):
        if flow.request.host not in ("127.0.0.1", "localhost"):
            flow.response = http.Response.make(
                421,
                b"Fault probe blocks non-loopback upstream",
                {"content-type": "text/plain"},
            )


addons = [LoopbackGuard()]
