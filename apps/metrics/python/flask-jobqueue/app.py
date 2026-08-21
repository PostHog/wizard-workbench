"""Order API: accepts orders over HTTP, hands them to the background worker."""

import os
import time

from flask import Flask, g, jsonify, request
from posthog import Posthog

from worker import JobQueue

app = Flask(__name__)

posthog = Posthog(
    os.environ.get("POSTHOG_API_KEY", "phc_test_dummy_key"),
    host=os.environ.get("POSTHOG_HOST", "https://us.i.posthog.com"),
    metrics={"service_name": "flask-jobqueue"},
)

queue = JobQueue(posthog=posthog)

ORDERS: list[dict] = []


@app.before_request
def _record_start():
    g.start_time = time.time()


@app.after_request
def _record_request(response):
    duration_ms = (time.time() - g.start_time) * 1000
    route = str(request.url_rule) if request.url_rule else "unknown"
    attrs = {"route": route, "method": request.method, "status": str(response.status_code)}
    posthog.metrics.count("http.requests", 1, attributes=attrs)
    posthog.metrics.histogram("http.request.duration", duration_ms, unit="ms", attributes={"route": route})
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
    posthog.capture(
        distinct_id=f"user_{order['id'] % 7}",
        event="order created",
        properties={"item": order["item"], "qty": order["qty"]},
    )
    posthog.metrics.count("orders.placed", 1)
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
