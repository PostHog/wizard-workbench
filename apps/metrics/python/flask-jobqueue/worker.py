"""Background worker: drains the order queue and notifies a fulfillment API."""

import queue
import threading
import time

import requests

FULFILLMENT_URL = "https://httpbin.org/status/200"


class JobQueue:
    def __init__(self) -> None:
        self._queue: queue.Queue = queue.Queue()
        self._thread = threading.Thread(target=self._drain, daemon=True)

    def start(self) -> None:
        self._thread.start()

    def submit(self, order: dict) -> None:
        self._queue.put(order)
        from app import posthog

        posthog.metrics.gauge("queue.depth", self._queue.qsize())

    def depth(self) -> int:
        return self._queue.qsize()

    def _drain(self) -> None:
        from app import posthog

        while True:
            order = self._queue.get()
            started = time.perf_counter()
            outcome = "success"
            external_started = time.perf_counter()
            try:
                response = requests.post(FULFILLMENT_URL, json=order, timeout=5)
                if not response.ok:
                    outcome = "error"
            except requests.RequestException:
                outcome = "error"
            posthog.metrics.count(
                "fulfillment.requests", attributes={"outcome": outcome}
            )
            posthog.metrics.histogram(
                "fulfillment.request.duration",
                (time.perf_counter() - external_started) * 1000,
                unit="ms",
                attributes={"outcome": outcome},
            )
            time.sleep(max(0.0, 0.1 - (time.perf_counter() - started)))
            self._queue.task_done()
            posthog.metrics.count("jobs.processed", attributes={"outcome": outcome})
            posthog.metrics.histogram(
                "job.duration",
                (time.perf_counter() - started) * 1000,
                unit="ms",
                attributes={"outcome": outcome},
            )
            posthog.metrics.gauge("queue.depth", self._queue.qsize())
