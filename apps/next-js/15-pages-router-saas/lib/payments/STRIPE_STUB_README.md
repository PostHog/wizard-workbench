# Stripe Stub Mode

This directory contains a stub implementation of the Stripe API that allows you to develop and test the SaaS application without real Stripe API keys.

## Why Use Stub Mode?

- **No Stripe Account Required**: Develop without signing up for Stripe
- **Faster Development**: No network latency from API calls
- **Offline Development**: Work without internet connection
- **Predictable Testing**: Consistent mock data for testing
- **No API Limits**: No rate limiting or quotas
- **Free**: No charges or test mode transactions

## How to Enable Stub Mode

### Option 1: Environment Variable (Recommended)

Add to your [.env](.env) file:

```bash
STRIPE_MODE=stub
```

### Option 2: Invalid/Missing API Keys

The stub mode automatically activates if:
- `STRIPE_SECRET_KEY` is not set
- `STRIPE_SECRET_KEY` is set to `sk_test_***` (example value)

## What Gets Mocked

### Products & Prices

The stub provides three pre-configured products:

1. **Basic Plan**
   - Product ID: `prod_stub_basic`
   - Price ID: `price_stub_basic_monthly`
   - Price: $10.00/month
   - Trial: 14 days

2. **Pro Plan**
   - Product ID: `prod_stub_pro`
   - Price ID: `price_stub_pro_monthly`
   - Price: $25.00/month
   - Trial: 14 days

3. **Enterprise Plan**
   - Product ID: `prod_stub_enterprise`
   - Price ID: `price_stub_enterprise_monthly`
   - Price: $100.00/month
   - Trial: 14 days

### Checkout Sessions

When you create a checkout session in stub mode:
- A mock session ID is generated (`cs_stub_*`)
- A mock customer ID is created (`cus_stub_*`)
- A mock subscription ID is created (`sub_stub_*`)
- The user is redirected to the success URL
- All subscription data is stored in your local database

### Customer Portal

The billing portal session creates:
- A mock portal session ID (`bps_stub_*`)
- A redirect to your dashboard with a query param
- All configuration options are accepted

### Webhooks

Webhook events can be simulated by:
1. Calling the webhook endpoint directly
2. Sending mock event data in the request body
3. The stub will parse and process the event

Example webhook event:
```json
{
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
}
```

## Testing the Checkout Flow

1. **Navigate to Pricing Page**: `/pricing`
2. **Click on a Plan**: Choose any plan
3. **Get Redirected**: You'll see a "checkout" URL with session ID
4. **Auto-Complete**: The checkout automatically succeeds
5. **Return to Dashboard**: You're logged in with active subscription

The entire flow works without leaving your application!

## Console Logging

When stub mode is active, you'll see:
```
🎭 Running in Stripe STUB mode - no real API calls will be made
```

All stub operations log to console with `[Stripe Stub]` prefix:
```
[Stripe Stub] Creating checkout session: {...}
[Stripe Stub] Retrieving subscription: sub_stub_123
[Stripe Stub] Listing products: {...}
```

## Subscription Statuses

The stub supports all subscription statuses:
- `trialing` (default for new subscriptions)
- `active`
- `canceled`
- `unpaid`
- `past_due`

## Limitations

The stub implementation:
- ✅ Supports all core SaaS functionality
- ✅ Works with the pricing page
- ✅ Processes checkout sessions
- ✅ Handles webhooks
- ✅ Manages customer portal
- ❌ Does NOT process real payments
- ❌ Does NOT send Stripe emails
- ❌ Does NOT create actual Stripe resources
- ❌ Does NOT validate real payment methods

## Switching to Real Stripe

When you're ready to use real Stripe:

1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Update your `.env` file:
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_real_key
   STRIPE_WEBHOOK_SECRET=whsec_your_real_secret
   # Remove or comment out:
   # STRIPE_MODE=stub
   ```
4. Restart your development server
5. Set up real products and prices in Stripe Dashboard
6. Configure webhook endpoints in Stripe

## Files

- [stripe-stub.ts](stripe-stub.ts) - Stub implementation
- [stripe.ts](stripe.ts) - Main Stripe client (auto-detects stub mode)
- `STRIPE_STUB_README.md` - This file

## Development Tips

1. **Use stub mode for UI development** - Build out forms, buttons, and flows
2. **Use real Stripe for payment testing** - Verify actual payment processing
3. **Keep stub data simple** - Extend the stub as needed for your use case
4. **Log everything** - The stub logs all operations for debugging

## Extending the Stub

To add more mock products or customize behavior, edit [stripe-stub.ts](stripe-stub.ts):

```typescript
// Add a new product
{
  id: 'prod_stub_custom',
  name: 'Custom Plan',
  description: 'A custom plan',
  active: true,
}
```

## Troubleshooting

**Q: My checkout isn't working**
A: Check the console for `[Stripe Stub]` logs to see what's happening

**Q: I'm not seeing stub mode**
A: Verify `STRIPE_MODE=stub` in your `.env` and restart the dev server

**Q: Can I use this in production?**
A: No! Stub mode is for development only. Always use real Stripe in production.

**Q: How do I test webhooks?**
A: Send POST requests to `/api/stripe/webhook` with mock event data

## Support

For issues with the stub implementation, check:
1. Console logs for `[Stripe Stub]` messages
2. Your `.env` configuration
3. The stub source code in [stripe-stub.ts](stripe-stub.ts)

For real Stripe issues, see [Stripe Documentation](https://stripe.com/docs).
