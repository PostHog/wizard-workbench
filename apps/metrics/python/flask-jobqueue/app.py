"""Order API: accepts orders over HTTP, hands them to the background worker."""

import os
import time

from flask import Flask, jsonify, request
from posthog import Posthog

from worker import JobQueue

app = Flask(__name__)

posthog = Posthog(
    os.environ.get("POSTHOG_API_KEY", "phc_test_dummy_key"),
    host=os.environ.get("POSTHOG_HOST", "https://us.i.posthog.com"),
)

queue = JobQueue()

ORDERS: list[dict] = []


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
