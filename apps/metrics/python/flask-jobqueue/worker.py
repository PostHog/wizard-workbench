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

    def depth(self) -> int:
        return self._queue.qsize()

    def _drain(self) -> None:
        while True:
            order = self._queue.get()
            started = time.time()
            try:
                requests.post(FULFILLMENT_URL, json=order, timeout=5)
            except requests.RequestException:
                pass
            time.sleep(max(0.0, 0.1 - (time.time() - started)))
            self._queue.task_done()
