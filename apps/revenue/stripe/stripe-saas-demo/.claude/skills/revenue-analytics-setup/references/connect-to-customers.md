# Connect to customers - Docs

**Revenue analytics is being deprecated**

We'll remove the Revenue analytics dashboard on or after **June 30th, 2026**.

We're not stepping away from revenue in PostHog — we're rethinking how it should work. Instead of maintaining a single, opinionated Revenue analytics dashboard, we're focusing on exposing revenue properties on persons and groups so you can use them everywhere: insights, SQL, and persons/groups profiles. Each use case (ecommerce, SaaS, recurring revenue, one-off, services, multi-tenant) can then build the dashboard it actually needs — or have PostHog AI and agents via our MCP build it for you.

PostHog automatically connects revenue data to persons and groups when you use revenue events. For data warehouse sources, you need to map the connection manually.

## Step 1: Add metadata when creating new customers

Search your codebase for where you create Stripe customers (e.g. `stripe.Customer.create` or equivalent) and add the `posthog_person_distinct_id` metadata field.

PostHog AI

### Python

```python
customer = stripe.Customer.create(
    email=user.email,
    metadata={"posthog_person_distinct_id": user.posthog_distinct_id},
)
```

### Node.js

```javascript
const customer = await stripe.customers.create({
  email: user.email,
  metadata: { posthog_person_distinct_id: user.posthogDistinctId },
});
```

### Ruby

```ruby
customer = Stripe::Customer.create({
  email: user.email,
  metadata: { posthog_person_distinct_id: user.posthog_distinct_id },
})
```

### PHP

```php
$customer = $stripe->customers->create([
    'email' => $user->email,
    'metadata' => ['posthog_person_distinct_id' => $user->posthogDistinctId],
]);
```

### Go

```go
params := &stripe.CustomerParams{
    Email: stripe.String(user.Email),
}
params.AddMetadata("posthog_person_distinct_id", user.PosthogDistinctID)
cust, err := customer.New(params)
```

### Java

```java
CustomerCreateParams params = CustomerCreateParams.builder()
    .setEmail(user.getEmail())
    .putMetadata("posthog_person_distinct_id", user.getPosthogDistinctId())
    .build();
Customer customer = Customer.create(params);
```

### dotnet

```dotnet
var options = new CustomerCreateOptions
{
    Email = user.Email,
    Metadata = new Dictionary<string, string>
    {
        { "posthog_person_distinct_id", user.PosthogDistinctId },
    },
};
var customer = await customerService.CreateAsync(options);
```

## Step 2: Tag existing customers via charges, subscriptions, or invoices

For customers created before you added the metadata in step 1, you don't need to update the customer object directly. Instead, pass `posthog_person_distinct_id` as metadata on any charge, subscription, or invoice tied to that customer. PostHog automatically resolves it from the most recently created child object.

Add the metadata to whichever Stripe call you already make. Here are the most common patterns:

### Subscriptions

PostHog AI

### Python

```python
stripe.Subscription.create(
    customer=user.stripe_customer_id,
    items=[{"price": "price_xxx"}],
    metadata={"posthog_person_distinct_id": user.posthog_distinct_id},
)
```

### Node.js

```javascript
await stripe.subscriptions.create({
  customer: user.stripeCustomerId,
  items: [{ price: 'price_xxx' }],
  metadata: { posthog_person_distinct_id: user.posthogDistinctId },
});
```

### Ruby

```ruby
Stripe::Subscription.create({
  customer: user.stripe_customer_id,
  items: [{ price: 'price_xxx' }],
  metadata: { posthog_person_distinct_id: user.posthog_distinct_id },
})
```

### PHP

```php
$stripe->subscriptions->create([
    'customer' => $user->stripeCustomerId,
    'items' => [['price' => 'price_xxx']],
    'metadata' => ['posthog_person_distinct_id' => $user->posthogDistinctId],
]);
```

### Go

```go
params := &stripe.SubscriptionParams{
    Customer: stripe.String(user.StripeCustomerID),
    Items: []*stripe.SubscriptionItemsParams{
        {Price: stripe.String("price_xxx")},
    },
}
params.AddMetadata("posthog_person_distinct_id", user.PosthogDistinctID)
sub, err := subscription.New(params)
```

### Java

```java
SubscriptionCreateParams params = SubscriptionCreateParams.builder()
    .setCustomer(user.getStripeCustomerId())
    .addItem(SubscriptionCreateParams.Item.builder().setPrice("price_xxx").build())
    .putMetadata("posthog_person_distinct_id", user.getPosthogDistinctId())
    .build();
Subscription subscription = Subscription.create(params);
```

### dotnet

```dotnet
var options = new SubscriptionCreateOptions
{
    Customer = user.StripeCustomerId,
    Items = new List<SubscriptionItemOptions>
    {
        new() { Price = "price_xxx" },
    },
    Metadata = new Dictionary<string, string>
    {
        { "posthog_person_distinct_id", user.PosthogDistinctId },
    },
};
var subscription = await subscriptionService.CreateAsync(options);
```

### One-off charges (payment intents)

PostHog AI

### Python

```python
stripe.PaymentIntent.create(
    amount=1000,
    currency="usd",
    customer=user.stripe_customer_id,
    metadata={"posthog_person_distinct_id": user.posthog_distinct_id},
)
```

### Node.js

```javascript
await stripe.paymentIntents.create({
  amount: 1000,
  currency: 'usd',
  customer: user.stripeCustomerId,
  metadata: { posthog_person_distinct_id: user.posthogDistinctId },
});
```

### Ruby

```ruby
Stripe::PaymentIntent.create({
  amount: 1000,
  currency: 'usd',
  customer: user.stripe_customer_id,
  metadata: { posthog_person_distinct_id: user.posthog_distinct_id },
})
```

### PHP

```php
$stripe->paymentIntents->create([
    'amount' => 1000,
    'currency' => 'usd',
    'customer' => $user->stripeCustomerId,
    'metadata' => ['posthog_person_distinct_id' => $user->posthogDistinctId],
]);
```

### Go

```go
params := &stripe.PaymentIntentParams{
    Amount:   stripe.Int64(1000),
    Currency: stripe.String(string(stripe.CurrencyUSD)),
    Customer: stripe.String(user.StripeCustomerID),
}
params.AddMetadata("posthog_person_distinct_id", user.PosthogDistinctID)
pi, err := paymentintent.New(params)
```

### Java

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setAmount(1000L)
    .setCurrency("usd")
    .setCustomer(user.getStripeCustomerId())
    .putMetadata("posthog_person_distinct_id", user.getPosthogDistinctId())
    .build();
PaymentIntent intent = PaymentIntent.create(params);
```

### dotnet

```dotnet
var options = new PaymentIntentCreateOptions
{
    Amount = 1000,
    Currency = "usd",
    Customer = user.StripeCustomerId,
    Metadata = new Dictionary<string, string>
    {
        { "posthog_person_distinct_id", user.PosthogDistinctId },
    },
};
var intent = await paymentIntentService.CreateAsync(options);
```

### Stripe Checkout

Pass the metadata in the checkout session's `subscription_data` or `payment_intent_data` depending on your checkout mode. Also set `client_reference_id` to your internal user ID so you can look up the distinct ID.

PostHog AI

### Python

```python
# For recurring (subscription) checkout
session = stripe.checkout.Session.create(
    mode="subscription",
    client_reference_id=user.id,
    subscription_data={
        "metadata": {"posthog_person_distinct_id": user.posthog_distinct_id},
    },
    # ... other params
)
# For one-time payment checkout
session = stripe.checkout.Session.create(
    mode="payment",
    client_reference_id=user.id,
    payment_intent_data={
        "metadata": {"posthog_person_distinct_id": user.posthog_distinct_id},
    },
    # ... other params
)
```

### Node.js

```javascript
// For recurring (subscription) checkout
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  client_reference_id: user.id,
  subscription_data: {
    metadata: { posthog_person_distinct_id: user.posthogDistinctId },
  },
  // ... other params
});
// For one-time payment checkout
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  client_reference_id: user.id,
  payment_intent_data: {
    metadata: { posthog_person_distinct_id: user.posthogDistinctId },
  },
  // ... other params
});
```

### Ruby

```ruby
# For recurring (subscription) checkout
session = Stripe::Checkout::Session.create({
  mode: 'subscription',
  client_reference_id: user.id,
  subscription_data: {
    metadata: { posthog_person_distinct_id: user.posthog_distinct_id },
  },
  # ... other params
})
# For one-time payment checkout
session = Stripe::Checkout::Session.create({
  mode: 'payment',
  client_reference_id: user.id,
  payment_intent_data: {
    metadata: { posthog_person_distinct_id: user.posthog_distinct_id },
  },
  # ... other params
})
```

### PHP

```php
// For recurring (subscription) checkout
$session = $stripe->checkout->sessions->create([
    'mode' => 'subscription',
    'client_reference_id' => $user->id,
    'subscription_data' => [
        'metadata' => ['posthog_person_distinct_id' => $user->posthogDistinctId],
    ],
    // ... other params
]);
// For one-time payment checkout
$session = $stripe->checkout->sessions->create([
    'mode' => 'payment',
    'client_reference_id' => $user->id,
    'payment_intent_data' => [
        'metadata' => ['posthog_person_distinct_id' => $user->posthogDistinctId],
    ],
    // ... other params
]);
```

### Go

```go
// For recurring (subscription) checkout
params := &stripe.CheckoutSessionParams{
    Mode:               stripe.String(string(stripe.CheckoutSessionModeSubscription)),
    ClientReferenceID:  stripe.String(user.ID),
    SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
        Metadata: map[string]string{
            "posthog_person_distinct_id": user.PosthogDistinctID,
        },
    },
}
session, err := checkoutsession.New(params)
// For one-time payment checkout
params := &stripe.CheckoutSessionParams{
    Mode:               stripe.String(string(stripe.CheckoutSessionModePayment)),
    ClientReferenceID:  stripe.String(user.ID),
    PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
        Metadata: map[string]string{
            "posthog_person_distinct_id": user.PosthogDistinctID,
        },
    },
}
session, err := checkoutsession.New(params)
```

### Java

```java
// For recurring (subscription) checkout
SessionCreateParams params = SessionCreateParams.builder()
    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
    .setClientReferenceId(user.getId())
    .setSubscriptionData(
        SessionCreateParams.SubscriptionData.builder()
            .putMetadata("posthog_person_distinct_id", user.getPosthogDistinctId())
            .build()
    )
    .build();
Session session = Session.create(params);
// For one-time payment checkout
SessionCreateParams params = SessionCreateParams.builder()
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .setClientReferenceId(user.getId())
    .setPaymentIntentData(
        SessionCreateParams.PaymentIntentData.builder()
            .putMetadata("posthog_person_distinct_id", user.getPosthogDistinctId())
            .build()
    )
    .build();
Session session = Session.create(params);
```

### dotnet

```dotnet
// For recurring (subscription) checkout
var options = new SessionCreateOptions
{
    Mode = "subscription",
    ClientReferenceId = user.Id,
    SubscriptionData = new SessionSubscriptionDataOptions
    {
        Metadata = new Dictionary<string, string>
        {
            { "posthog_person_distinct_id", user.PosthogDistinctId },
        },
    },
};
var session = await sessionService.CreateAsync(options);
// For one-time payment checkout
var options = new SessionCreateOptions
{
    Mode = "payment",
    ClientReferenceId = user.Id,
    PaymentIntentData = new SessionPaymentIntentDataOptions
    {
        Metadata = new Dictionary<string, string>
        {
            { "posthog_person_distinct_id", user.PosthogDistinctId },
        },
    },
};
var session = await sessionService.CreateAsync(options);
```

> **How does this work?** PostHog looks for `posthog_person_distinct_id` in the metadata of subscriptions, charges, and invoices tied to each Stripe customer. If the customer object doesn't have the metadata directly, PostHog uses the value from the most recently created child object.

Once this is connected you'll be able to properly see who your top customers are in the [Top customers dashboard](https://app.posthog.com/revenue_analytics#top-customers).

You'll also get access to the `persons_revenue_analytics` and `groups_revenue_analytics` tables in the [data warehouse](https://app.posthog.com/data-warehouse). This is a simple map of `person_id`/`group_key` to what their all-time revenue is.

SQL

[Run in PostHog](https://us.posthog.com/sql?open_query=--+Count+the+number+of+persons+with+revenue+greater+than+1%2C000%2C000%0ASELECT+COUNT%28*%29%0AFROM+persons_revenue_analytics%0AWHERE+amount+%3E+1000000)

PostHog AI

```sql
-- Count the number of persons with revenue greater than 1,000,000
SELECT COUNT(*)
FROM persons_revenue_analytics
WHERE amount > 1000000
```

### Community questions

Ask a question

### Was this page useful?

HelpfulCould be better