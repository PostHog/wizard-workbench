import uuid
import posthog
from posthog import new_context, identify_context, capture
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone
from datetime import timedelta
from .models import Plan, Subscription

# Check if Stripe is configured
STRIPE_CONFIGURED = bool(getattr(settings, 'STRIPE_SECRET_KEY', ''))

if STRIPE_CONFIGURED:
    import stripe
    stripe.api_key = settings.STRIPE_SECRET_KEY


def pricing(request):
    """Display pricing plans."""
    plans = Plan.objects.filter(is_active=True)
    return render(request, 'billing/pricing.html', {'plans': plans})


@login_required
def subscribe(request, plan_slug):
    """Subscribe to a plan - redirects to Stripe Checkout or creates demo subscription."""
    plan = get_object_or_404(Plan, slug=plan_slug, is_active=True)

    # Check if user already has an active subscription
    existing = request.user.subscriptions.filter(status='active').first()
    if existing:
        messages.warning(request, 'You already have an active subscription.')
        return redirect('billing:manage')

    if request.method == 'POST':
        if STRIPE_CONFIGURED and plan.stripe_price_id:
            # Create Stripe Checkout Session
            try:
                checkout_session = stripe.checkout.Session.create(
                    customer_email=request.user.email,
                    payment_method_types=['card'],
                    line_items=[{
                        'price': plan.stripe_price_id,
                        'quantity': 1,
                    }],
                    mode='subscription',
                    success_url=request.build_absolute_uri('/billing/success/') + '?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url=request.build_absolute_uri('/billing/pricing/'),
                    metadata={
                        'user_id': request.user.id,
                        'plan_id': plan.id,
                    },
                    allow_promotion_codes=True,
                )

                with new_context():
                    identify_context(str(request.user.id))
                    capture('subscription_started', properties={
                        'plan_name': plan.name,
                        'plan_interval': plan.interval,
                        'via_stripe': True,
                    })

                return redirect(checkout_session.url)
            except Exception as e:
                posthog.capture_exception(e)
                messages.error(request, f'Payment error: {str(e)}')
                return redirect('billing:pricing')
        else:
            # Demo mode - create subscription directly
            now = timezone.now()
            Subscription.objects.create(
                user=request.user,
                plan=plan,
                status='active',
                current_period_start=now,
                current_period_end=now + timedelta(days=30 if plan.interval == 'month' else 365),
                stripe_subscription_id=f'sub_demo_{uuid.uuid4().hex[:12]}',
            )

            with new_context():
                identify_context(str(request.user.id))
                capture('subscription_started', properties={
                    'plan_name': plan.name,
                    'plan_interval': plan.interval,
                    'via_stripe': False,
                })

            messages.success(request, f'Successfully subscribed to {plan.name}! (Demo mode)')
            return redirect('dashboard:index')

    return render(request, 'billing/subscribe.html', {
        'plan': plan,
        'stripe_configured': STRIPE_CONFIGURED,
    })


@login_required
def success(request):
    """Handle successful Stripe checkout."""
    session_id = request.GET.get('session_id')

    if STRIPE_CONFIGURED and session_id:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            messages.success(request, 'Subscription successful! Welcome aboard.')
        except Exception:
            messages.warning(request, 'Could not verify payment. Please check your subscription status.')

    return redirect('dashboard:index')


@login_required
def manage(request):
    """Manage subscription - view current plan, upgrade/downgrade options."""
    subscription = request.user.get_active_subscription()
    plans = Plan.objects.filter(is_active=True)
    return render(request, 'billing/manage.html', {
        'subscription': subscription,
        'plans': plans,
        'stripe_configured': STRIPE_CONFIGURED,
    })


@login_required
def change_plan(request, plan_slug):
    """Change subscription plan."""
    plan = get_object_or_404(Plan, slug=plan_slug, is_active=True)
    subscription = request.user.get_active_subscription()

    if not subscription:
        return redirect('billing:subscribe', plan_slug=plan_slug)

    if request.method == 'POST':
        previous_plan = subscription.plan.name
        if STRIPE_CONFIGURED and subscription.stripe_subscription_id and not subscription.stripe_subscription_id.startswith('sub_demo_'):
            # Update Stripe subscription
            try:
                stripe_sub = stripe.Subscription.retrieve(subscription.stripe_subscription_id)
                stripe.Subscription.modify(
                    subscription.stripe_subscription_id,
                    items=[{
                        'id': stripe_sub['items']['data'][0].id,
                        'price': plan.stripe_price_id,
                    }],
                    proration_behavior='create_prorations',
                )
                subscription.plan = plan
                subscription.save()

                with new_context():
                    identify_context(str(request.user.id))
                    capture('plan_changed', properties={
                        'previous_plan': previous_plan,
                        'new_plan': plan.name,
                        'new_plan_interval': plan.interval,
                    })

                messages.success(request, f'Plan changed to {plan.name}.')
            except Exception as e:
                posthog.capture_exception(e)
                messages.error(request, f'Error changing plan: {str(e)}')
        else:
            # Demo mode
            subscription.plan = plan
            subscription.save()

            with new_context():
                identify_context(str(request.user.id))
                capture('plan_changed', properties={
                    'previous_plan': previous_plan,
                    'new_plan': plan.name,
                    'new_plan_interval': plan.interval,
                })

            messages.success(request, f'Plan changed to {plan.name}. (Demo mode)')

        return redirect('billing:manage')

    return render(request, 'billing/change_plan.html', {
        'plan': plan,
        'subscription': subscription,
    })


@login_required
def cancel(request):
    """Cancel subscription."""
    subscription = request.user.get_active_subscription()

    if not subscription:
        messages.warning(request, 'No active subscription to cancel.')
        return redirect('billing:manage')

    if request.method == 'POST':
        if STRIPE_CONFIGURED and subscription.stripe_subscription_id and not subscription.stripe_subscription_id.startswith('sub_demo_'):
            # Cancel at period end in Stripe
            try:
                stripe.Subscription.modify(
                    subscription.stripe_subscription_id,
                    cancel_at_period_end=True,
                )
            except Exception as e:
                posthog.capture_exception(e)
                messages.error(request, f'Error canceling: {str(e)}')
                return redirect('billing:manage')

        plan_name = subscription.plan.name
        subscription.status = 'canceled'
        subscription.canceled_at = timezone.now()
        subscription.save()

        with new_context():
            identify_context(str(request.user.id))
            capture('subscription_canceled', properties={
                'plan_name': plan_name,
            })

        messages.success(request, 'Subscription canceled. You will have access until the end of your billing period.')
        return redirect('billing:manage')

    return render(request, 'billing/cancel.html', {'subscription': subscription})


@login_required
def billing_portal(request):
    """Redirect to Stripe Billing Portal for self-service management."""
    if not STRIPE_CONFIGURED:
        messages.info(request, 'Billing portal is not available in demo mode.')
        return redirect('billing:manage')

    subscription = request.user.get_active_subscription()
    if not subscription or not subscription.stripe_customer_id:
        messages.warning(request, 'No billing information found.')
        return redirect('billing:manage')

    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=subscription.stripe_customer_id,
            return_url=request.build_absolute_uri('/billing/manage/'),
        )
        return redirect(portal_session.url)
    except Exception as e:
        posthog.capture_exception(e)
        messages.error(request, f'Error accessing billing portal: {str(e)}')
        return redirect('billing:manage')


@csrf_exempt
@require_POST
def webhook(request):
    """Handle Stripe webhooks."""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', '')

    if not STRIPE_CONFIGURED or not webhook_secret:
        return HttpResponse(status=400)

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        return HttpResponse(status=400)
    except Exception:
        return HttpResponse(status=400)

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        _handle_checkout_completed(session)
    elif event['type'] == 'customer.subscription.updated':
        subscription_data = event['data']['object']
        _handle_subscription_updated(subscription_data)
    elif event['type'] == 'customer.subscription.deleted':
        subscription_data = event['data']['object']
        _handle_subscription_deleted(subscription_data)
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        _handle_payment_failed(invoice)

    return HttpResponse(status=200)


def _handle_checkout_completed(session):
    """Create subscription after successful checkout."""
    from accounts.models import User

    user_id = session.get('metadata', {}).get('user_id')
    plan_id = session.get('metadata', {}).get('plan_id')

    if not user_id or not plan_id:
        return

    try:
        user = User.objects.get(id=user_id)
        plan = Plan.objects.get(id=plan_id)
    except (User.DoesNotExist, Plan.DoesNotExist):
        return

    # Get subscription details from Stripe
    stripe_sub = stripe.Subscription.retrieve(session['subscription'])

    Subscription.objects.create(
        user=user,
        plan=plan,
        status='active',
        current_period_start=timezone.datetime.fromtimestamp(
            stripe_sub['current_period_start'], tz=timezone.utc
        ),
        current_period_end=timezone.datetime.fromtimestamp(
            stripe_sub['current_period_end'], tz=timezone.utc
        ),
        stripe_subscription_id=stripe_sub['id'],
        stripe_customer_id=stripe_sub['customer'],
    )

    with new_context():
        identify_context(str(user.id))
        capture('checkout_completed', properties={
            'plan_name': plan.name,
            'plan_interval': plan.interval,
        })


def _handle_subscription_updated(subscription_data):
    """Update subscription status."""
    try:
        subscription = Subscription.objects.get(
            stripe_subscription_id=subscription_data['id']
        )
    except Subscription.DoesNotExist:
        return

    status_map = {
        'active': 'active',
        'past_due': 'past_due',
        'canceled': 'canceled',
        'trialing': 'trialing',
        'paused': 'paused',
    }

    subscription.status = status_map.get(subscription_data['status'], 'active')
    subscription.current_period_start = timezone.datetime.fromtimestamp(
        subscription_data['current_period_start'], tz=timezone.utc
    )
    subscription.current_period_end = timezone.datetime.fromtimestamp(
        subscription_data['current_period_end'], tz=timezone.utc
    )
    subscription.save()


def _handle_subscription_deleted(subscription_data):
    """Handle subscription cancellation."""
    try:
        subscription = Subscription.objects.get(
            stripe_subscription_id=subscription_data['id']
        )
        subscription.status = 'canceled'
        subscription.canceled_at = timezone.now()
        subscription.save()
    except Subscription.DoesNotExist:
        pass


def _handle_payment_failed(invoice):
    """Handle failed payment."""
    subscription_id = invoice.get('subscription')
    if not subscription_id:
        return

    try:
        subscription = Subscription.objects.get(
            stripe_subscription_id=subscription_id
        )
        subscription.status = 'past_due'
        subscription.save()

        with new_context():
            identify_context(str(subscription.user.id))
            capture('payment_failed', properties={
                'plan_name': subscription.plan.name,
            })
    except Subscription.DoesNotExist:
        pass
