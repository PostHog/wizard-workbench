"""Background worker: drains the order queue and notifies a fulfillment API."""

import queue
import threading
import time

import requests

FULFILLMENT_URL = "https://httpbin.org/status/200"


class JobQueue:
    def __init__(self, posthog=None) -> None:
        self._queue: queue.Queue = queue.Queue()
        self._thread = threading.Thread(target=self._drain, daemon=True)
        self._posthog = posthog

    def start(self) -> None:
        self._thread.start()

    def submit(self, order: dict) -> None:
        self._queue.put(order)

    def depth(self) -> int:
        return self._queue.qsize()

    def _drain(self) -> None:
        while True:
            order = self._queue.get()
            started = time.time()
            outcome = "success"
            try:
                requests.post(FULFILLMENT_URL, json=order, timeout=5)
            except requests.RequestException:
                outcome = "error"
            elapsed_ms = (time.time() - started) * 1000
            if self._posthog is not None:
                self._posthog.metrics.count("job.processed", 1, attributes={"outcome": outcome})
                self._posthog.metrics.histogram("job.duration", elapsed_ms, unit="ms")
                self._posthog.metrics.gauge("queue.depth", self._queue.qsize())
            time.sleep(max(0.0, 0.1 - (time.time() - started)))
            self._queue.task_done()
