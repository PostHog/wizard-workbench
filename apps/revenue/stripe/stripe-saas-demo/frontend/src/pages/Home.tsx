import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { posthog } from "../posthog";
import { createCheckoutSession, createCustomer } from "../api";

const BASIC_PRICE_ID = import.meta.env.VITE_STRIPE_BASIC_PRICE_ID;
const PRO_PRICE_ID = import.meta.env.VITE_STRIPE_PRO_PRICE_ID;

const plans = [
  { name: "Basic", price: "$10/mo", priceId: BASIC_PRICE_ID },
  { name: "Pro", price: "$25/mo", priceId: PRO_PRICE_ID },
];

export function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      posthog.capture("checkout_cancelled");
    }
  }, []);

  const isSignedUp = email && name;

  async function handleCheckout(priceId: string) {
    setLoading("checkout");
    setError(null);
    try {
      posthog.capture("checkout_initiated", { priceId, method: "stripe_checkout" });

      const distinctId = posthog.get_distinct_id();
      const { user } = await createCustomer(email, name, distinctId);

      const { url } = await createCheckoutSession(priceId, user.id, email);
      if (url) window.location.href = url;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleCustomForm(priceId: string) {
    setLoading("custom");
    setError(null);
    try {
      posthog.capture("checkout_initiated", { priceId, method: "custom_form" });

      const distinctId = posthog.get_distinct_id();
      const { user, customerId } = await createCustomer(email, name, distinctId);

      navigate(`/subscribe?customerId=${customerId}&priceId=${priceId}&userId=${user.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  function handleSignUp() {
    if (!email || !name) return;
    posthog.identify(email, { email, name });
    posthog.capture("user_signed_up");
  }

  return (
    <div>
      <h1>SaaS Demo</h1>
      <p>A simple subscription app for testing Stripe + PostHog integration.</p>

      <section style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>1. Sign up</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleSignUp} disabled={!email || !name} style={buttonStyle}>
            Sign up
          </button>
        </div>
      </section>

      <section>
        <h2>2. Choose a plan</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "1.5rem",
                flex: 1,
                minWidth: 200,
              }}
            >
              <h3>{plan.name}</h3>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{plan.price}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button
                  onClick={() => handleCheckout(plan.priceId)}
                  disabled={!isSignedUp || !!loading}
                  style={buttonStyle}
                >
                  {loading === "checkout" ? "Loading..." : "Subscribe (Checkout)"}
                </button>
                <button
                  onClick={() => handleCustomForm(plan.priceId)}
                  disabled={!isSignedUp || !!loading}
                  style={{ ...buttonStyle, background: "#444" }}
                >
                  {loading === "custom" ? "Loading..." : "Subscribe (Card Form)"}
                </button>
              </div>
            </div>
          ))}
        </div>
        {!isSignedUp && (
          <p style={{ color: "#888", marginTop: "1rem" }}>Enter your name and email above first.</p>
        )}
      </section>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: 4,
  flex: 1,
  minWidth: 150,
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  background: "#635bff",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
