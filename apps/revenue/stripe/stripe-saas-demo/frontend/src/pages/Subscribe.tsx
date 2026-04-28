import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { posthog } from "../posthog";
import { createSubscription } from "../api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/dashboard` },
      redirect: "if_required",
    });

    if (stripeError) {
      posthog.capture("payment_failed", {
        error_code: stripeError.code,
        error_type: stripeError.type,
        error_message: stripeError.message,
      });
      posthog.captureException(new Error(stripeError.message || "Payment failed"));
      setError(stripeError.message || "Payment failed");
      setLoading(false);
    } else {
      posthog.capture("subscription_started", { method: "custom_form" });
      navigate("/dashboard?subscribed=true");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          background: "#635bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          width: "100%",
        }}
      >
        {loading ? "Processing..." : "Subscribe"}
      </button>
    </form>
  );
}

export function Subscribe() {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const priceId = searchParams.get("priceId");
  const userId = searchParams.get("userId");

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreateSubscription() {
    if (!customerId || !priceId) return;
    setLoading(true);
    setError(null);

    try {
      const result = await createSubscription(customerId, priceId, userId || undefined);
      setClientSecret(result.clientSecret);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!customerId || !priceId) {
    return (
      <div>
        <h1>Missing parameters</h1>
        <p>Please start from the <a href="/">home page</a>.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Complete your subscription</h1>
      <p>Customer: <code>{customerId}</code></p>

      {!clientSecret && !error && (
        <button
          onClick={handleCreateSubscription}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            background: "#635bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {loading ? "Creating subscription..." : "Continue to payment"}
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
