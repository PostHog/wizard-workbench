# Testing Stripe Stub Mode

This guide shows you how to test the application using Stripe stub mode.

## Quick Start

1. **Enable stub mode** (already done in your `.env`):
   ```bash
   STRIPE_MODE=stub
   ```

2. **Start your development server**:
   ```bash
   pnpm dev
   ```

3. **Look for the stub mode indicator** in your console:
   ```
   🎭 Running in Stripe STUB mode - no real API calls will be made
   ```

## Testing Scenarios

### Scenario 1: View Pricing

1. Navigate to `http://localhost:3000/pricing`
2. You should see pricing plans displayed
3. The plans come from the stub (not real Stripe)

**Expected Stub Data:**
- Basic Plan: $10/month
- Pro Plan: $25/month
- Enterprise Plan: $100/month

### Scenario 2: Checkout Flow

1. Go to `/pricing`
2. Click "Subscribe" on any plan
3. You'll be redirected to checkout
4. The stub automatically completes checkout
5. You land on `/dashboard` with an active subscription

**What happens behind the scenes:**
```
[Stripe Stub] Creating checkout session
[Stripe Stub] Retrieving checkout session
[Stripe Stub] Retrieving subscription
```

**Database changes:**
- Team gets `stripeCustomerId` (e.g., `cus_stub_123456`)
- Team gets `stripeSubscriptionId` (e.g., `sub_stub_123456`)
- Team gets `stripeProductId` (e.g., `prod_stub_basic`)
- Team `subscriptionStatus` set to `trialing`

### Scenario 3: Customer Portal

1. From your dashboard, click "Manage Subscription"
2. You'll be redirected to a stub portal URL
3. The URL contains `?stub=billing-portal` query param

**Expected behavior:**
- No actual Stripe portal is opened
- You stay on your local application
- Can simulate subscription changes via webhooks

### Scenario 4: Webhook Simulation

Use curl or Postman to simulate a webhook:

```bash
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: stub_signature" \
  -d '{
    "type": "customer.subscription.updated",
    "data": {
      "object": {
        "id": "sub_stub_123",
        "customer": "cus_stub_123",
        "status": "active",
        "items": {
          "data": [{
            "plan": {
              "product": {
                "id": "prod_stub_basic",
                "name": "Basic Plan"
              }
            }
          }]
        }
      }
    }
  }'
```

**Expected response:**
```json
{ "received": true }
```

### Scenario 5: Subscription Cancellation

Simulate a cancellation webhook:

```bash
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: stub_signature" \
  -d '{
    "type": "customer.subscription.deleted",
    "data": {
      "object": {
        "id": "sub_stub_123",
        "customer": "cus_stub_123",
        "status": "canceled"
      }
    }
  }'
```

**Expected database changes:**
- `stripeSubscriptionId` → `null`
- `stripeProductId` → `null`
- `planName` → `null`
- `subscriptionStatus` → `canceled`

## Debugging Tips

### Enable Verbose Logging

All stub operations log to console. Look for:
```
[Stripe Stub] Creating checkout session: { priceId: 'price_stub_basic_monthly', ... }
[Stripe Stub] Retrieving subscription: sub_stub_123456
```

### Check Database State

After any operation, check your database:

```sql
SELECT
  id,
  name,
  stripeCustomerId,
  stripeSubscriptionId,
  stripeProductId,
  planName,
  subscriptionStatus
FROM teams;
```

### Common Issues

**Issue: Not seeing stub mode message**
- ✅ Solution: Make sure `.env` has `STRIPE_MODE=stub`
- ✅ Solution: Restart your dev server

**Issue: Checkout redirects to real Stripe**
- ✅ Solution: Check console for stub mode indicator
- ✅ Solution: Verify `STRIPE_MODE=stub` is set correctly

**Issue: Webhook fails**
- ✅ Solution: Include `stripe-signature` header (any value works)
- ✅ Solution: Check request body matches expected format

## Comparing Stub vs Real Stripe

| Feature | Stub Mode | Real Stripe |
|---------|-----------|-------------|
| Speed | Instant ⚡ | Network latency |
| Cost | Free 💰 | Test mode free, production paid |
| Internet Required | No 📡 | Yes |
| Payment Processing | Simulated ✨ | Real |
| Webhook Events | Manual 🔧 | Automatic |
| Customer Portal | Mocked 🎭 | Real Stripe UI |
| Product Management | Hardcoded 📝 | Dashboard managed |

## When to Use Each Mode

### Use Stub Mode For:
- ✅ Initial development
- ✅ UI/UX work
- ✅ Offline development
- ✅ Fast iteration
- ✅ Testing subscription logic
- ✅ CI/CD pipelines

### Use Real Stripe For:
- ✅ Payment flow testing
- ✅ Webhook integration testing
- ✅ Customer portal testing
- ✅ Pre-production testing
- ✅ Production deployment

## Switching Between Modes

### Enable Stub Mode
```bash
# In .env
STRIPE_MODE=stub
```

### Enable Real Stripe
```bash
# In .env
# STRIPE_MODE=stub  # Comment out or remove this line
```

Then restart your dev server.

## Next Steps

1. **Build your features** using stub mode
2. **Test thoroughly** with real Stripe in test mode
3. **Deploy to production** with real Stripe in live mode

## API Reference

See [stripe-stub.ts](stripe-stub.ts) for complete stub implementation details.

For real Stripe API, see [Stripe API Docs](https://stripe.com/docs/api).
