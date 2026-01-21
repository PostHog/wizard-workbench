# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Laravel SaaS application. The integration adds comprehensive event tracking for user authentication, subscription management, and profile updates using a centralized `PostHogService` class that wraps the PostHog PHP SDK.

## Configuration Files Created

| File | Description |
|------|-------------|
| `config/posthog.php` | PostHog configuration using environment variables |
| `app/Services/PostHogService.php` | Service class wrapping PostHog SDK with identify, capture, and error tracking methods |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed registration (form or OAuth) | `resources/views/livewire/pages/auth/register.blade.php`, `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | User successfully logged in (password or OAuth) | `resources/views/livewire/pages/auth/login.blade.php`, `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logged out of the application | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | User initiated checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User changed their subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | User updated their profile information | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | User changed their password | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | User deleted their account (churn event) | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `password_reset_requested` | User requested a password reset | `resources/views/livewire/pages/auth/forgot-password.blade.php` |

## User Identification

Users are identified with the following properties:
- `email` - User's email address
- `name` - User's display name
- `date_joined` - Account creation timestamp

## Error Tracking

Exception capture is integrated into:
- OAuth login failures (`app/Http/Controllers/Auth/SocialiteController.php`)
- Subscription plan swap failures (`app/Http/Controllers/SubscriptionController.php`)

## Environment Variables

Add the following to your `.env` file:

```env
POSTHOG_API_KEY=your_posthog_api_key
POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_DISABLED=false
```

## Next steps

### Create Recommended Dashboard & Insights

We recommend creating a dashboard named "Analytics Basics" with these insights:

1. **User Signup Funnel**: Track conversion from signup page view to `user_signed_up`
2. **Subscription Conversion Funnel**: `user_signed_up` → `subscription_checkout_started` → subscription success
3. **Churn Analysis**: Track `account_deleted` events over time with `days_since_signup` breakdown
4. **Authentication Methods**: Breakdown of `user_logged_in` by `login_method` property
5. **User Engagement**: Track active users based on login frequency

### Access Your PostHog Dashboard

Visit your PostHog instance to create these insights:
- PostHog US: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
