# flask-jobqueue

Tiny order-processing service: HTTP API in, background worker out.

PostHog is already here — `posthog==3.8.3` (pre-metrics) with a client
initialized in `app.py` and a capture call on order creation. The upgrade
path under test: bump the SDK past the metrics floor, add
`metrics={"service_name": ...}` to the existing client, touch nothing else.

Run:

```bash
pip install -r requirements.txt
python app.py
```

Traffic:

```bash
curl -X POST localhost:5001/orders -H 'Content-Type: application/json' -d '{"item": "widget", "qty": 2}'
curl localhost:5001/orders
curl localhost:5001/health
```
