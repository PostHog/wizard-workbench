import { useSearchParams } from "react-router-dom";
import { posthog } from "../posthog";
import { useEffect } from "react";

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const subscribed = searchParams.get("subscribed");

  useEffect(() => {
    if (sessionId || subscribed) {
      posthog.capture("subscription_started", {
        method: sessionId ? "stripe_checkout" : "custom_form",
        checkoutSessionId: sessionId,
      });
    }
  }, [sessionId, subscribed]);

  return (
    <div>
      <h1>Dashboard</h1>

      {(sessionId || subscribed) && (
        <div
          style={{
            padding: "1rem",
            background: "#e8f5e9",
            borderRadius: 8,
            marginBottom: "1rem",
          }}
        >
          Subscription activated successfully!
        </div>
      )}

      <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Your subscription</h2>
        <p>Status: <strong>Active</strong></p>
        {sessionId && <p>Checkout Session: <code>{sessionId}</code></p>}
        <p>PostHog Distinct ID: <code>{posthog.get_distinct_id?.() || "N/A"}</code></p>
      </div>

      <p style={{ marginTop: "1rem" }}>
        <a href="/">Back to home</a>
      </p>
    </div>
  );
}
