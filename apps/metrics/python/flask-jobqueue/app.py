"""Order API: accepts orders over HTTP, hands them to the background worker."""

import os
import time

from dotenv import load_dotenv
from flask import Flask, g, jsonify, request
from posthog import Posthog

from worker import JobQueue

load_dotenv()

app = Flask(__name__)

posthog = Posthog(
    os.environ.get("POSTHOG_API_KEY"),
    host=os.environ.get("POSTHOG_HOST"),
    enable_exception_autocapture=True,
    metrics={"service_name": "flask-jobqueue"},
)

queue = JobQueue()

ORDERS: list[dict] = []


@app.before_request
def start_request_metrics():
    g.request_started_at = time.perf_counter()


@app.after_request
def record_request_metrics(response):
    attributes = {
        "method": request.method,
        "route": request.url_rule.rule if request.url_rule else "unmatched",
        "status_class": f"{response.status_code // 100}xx",
    }
    posthog.metrics.count("http.server.requests", attributes=attributes)
    posthog.metrics.histogram(
        "http.server.duration",
        (time.perf_counter() - g.request_started_at) * 1000,
        unit="ms",
        attributes=attributes,
    )
    return response


@app.post("/orders")
def create_order():
    payload = request.get_json(force=True)
    order = {
        "id": len(ORDERS) + 1,
        "item": payload.get("item", "unknown"),
        "qty": int(payload.get("qty", 1)),
        "created_at": time.time(),
    }
    ORDERS.append(order)
    queue.submit(order)
    posthog.metrics.count("orders.placed")
    posthog.capture(
        distinct_id=f"user_{order['id'] % 7}",
        event="order created",
        properties={"item": order["item"], "qty": order["qty"]},
    )
    return jsonify(order), 201


@app.get("/orders")
def list_orders():
    return jsonify(ORDERS)


@app.get("/health")
def health():
    return jsonify({"ok": True, "queued": queue.depth()})


if __name__ == "__main__":
    queue.start()
    app.run(port=5001, debug=False)
