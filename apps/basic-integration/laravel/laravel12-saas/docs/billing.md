# Billing & Subscriptions Guide

MVPable comes with Stripe Cashier integration for handling subscriptions and billing.

## Stripe Setup

### 1. Get Stripe Keys

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers > API keys
3. Copy your Publishable key and Secret key

### 2. Configure Environment

Add to `.env`:

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Set Up Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/webhook/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `.env`

## Creating Plans

### Using Filament Admin

1. Go to `/admin`
2. Navigate to Plans
3. Click "New Plan"
4. Fill in:
   - Name
   - Stripe Price ID
   - Features (JSON array)
   - Is Active

### Programmatically

```php
use App\Models\Plan;

Plan::create([
    'name' => 'Pro',
    'stripe_price_id' => 'price_...',
    'features' => ['feature1', 'feature2'],
    'is_active' => true,
]);
```

## Subscription Flow

### Checkout

```php
use App\Http\Controllers\SubscriptionController;

// In your controller
public function checkout(Request $request)
{
    $user = auth()->user();
    $plan = Plan::find($request->plan_id);

    return $user->checkout([$plan->stripe_price_id], [
        'success_url' => route('dashboard'),
        'cancel_url' => route('subscribe'),
    ]);
}
```

### Check Subscription Status

```php
$user = auth()->user();

if ($user->subscribed()) {
    // User has active subscription
}

if ($user->subscribedToPrice($plan->stripe_price_id)) {
    // User subscribed to specific plan
}
```

### Swap Plans

```php
$user = auth()->user();
$newPlan = Plan::find($request->plan_id);

$user->subscription()->swap($newPlan->stripe_price_id);
```

## Billing Portal

Redirect users to Stripe Customer Portal:

```php
return $user->redirectToBillingPortal(route('dashboard'));
```

Or use the route:

```php
Route::get('/billing-portal', [SubscriptionController::class, 'redirectToBillingPortal'])
    ->name('billing-portal');
```

## Subscription Events

Handle Stripe webhook events in `app/Http/Controllers/WebhookController.php`:

```php
public function handleWebhook(Request $request)
{
    $payload = $request->all();
    $event = $payload['type'];

    switch ($event) {
        case 'customer.subscription.created':
            // Handle subscription created
            break;
        case 'customer.subscription.updated':
            // Handle subscription updated
            break;
        case 'invoice.payment_failed':
            // Handle failed payment
            break;
    }
}
```

## Testing

### Test Cards

Use Stripe test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Webhooks

Use Stripe CLI:

```bash
stripe listen --forward-to localhost:8000/webhook/stripe
```

## Subscription Features

### Check Features

```php
$user = auth()->user();
$subscription = $user->subscription;

if ($subscription && in_array('feature_name', $subscription->plan->features)) {
    // User has access to feature
}
```

### Middleware

Create middleware to protect routes:

```php
// app/Http/Middleware/EnsureUserIsSubscribed.php
public function handle(Request $request, Closure $next)
{
    if (!auth()->user()->subscribed()) {
        return redirect()->route('subscribe');
    }

    return $next($request);
}
```

## Next Steps

- [Configuration Guide](configuration.md)
- [Admin Panel](admin-panel.md)
- [Deployment Guide](deployment.md)
