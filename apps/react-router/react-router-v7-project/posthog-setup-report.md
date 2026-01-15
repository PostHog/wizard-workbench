# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 Framework mode project. The integration includes:

- **Client-side SDK initialization** via `posthog-js` and `@posthog/react` in `entry.client.tsx`
- **Server-side middleware** using `posthog-node` for server-side event tracking with session correlation
- **User identification** on login and signup with proper `identify()` calls
- **Session reset** on logout to maintain user privacy and accurate analytics
- **Error tracking** via `captureException()` in the error boundary
- **Custom event tracking** for key user interactions and conversion events

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in to their account | `app/routes/login.tsx` |
| `user_logged_out` | User logs out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country (main conversion action) | `app/routes/countries.tsx` |
| `country_liked` | User likes a country | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited | `app/routes/countries.tsx` |
| `country_search` | User searches for countries (3+ characters) | `app/routes/countries.tsx` |
| `country_filter_region` | User filters countries by region | `app/routes/countries.tsx` |
| `explore_cta_clicked` | User clicks the Explore Now CTA on homepage | `app/routes/home.tsx` |
| `learn_more_clicked` | User clicks Learn More button on homepage | `app/routes/home.tsx` |

## Files Modified

| File | Changes |
|------|---------|
| `.env` | Added PostHog API key and host environment variables |
| `vite.config.ts` | Added SSR noExternal config and proxy for PostHog |
| `react-router.config.ts` | Enabled v8 middleware for server-side tracking |
| `app/lib/posthog-middleware.ts` | **New file** - Server-side PostHog middleware |
| `app/entry.client.tsx` | Added PostHog initialization and PostHogProvider |
| `app/root.tsx` | Added middleware export and error boundary tracking |
| `app/routes/login.tsx` | Added identify and user_logged_in capture |
| `app/routes/signup.tsx` | Added identify and user_signed_up capture |
| `app/routes/profile.tsx` | Added user_logged_out capture and reset |
| `app/routes/countries.tsx` | Added tracking for country actions and filters |
| `app/routes/home.tsx` | Added CTA click tracking |

## Next steps

### View your analytics

Visit your PostHog dashboard to see the events being captured:
- **Activity Feed**: https://us.posthog.com/activity/explore - View all captured events in real-time
- **Insights**: https://us.posthog.com/insights - Create custom insights from your events

### Suggested insights to create

Based on the events instrumented, consider creating these insights:

1. **Signup to First Claim Funnel**: Track conversion from `user_signed_up` → `country_claimed`
2. **User Engagement Trends**: Track daily/weekly trends of `country_claimed`, `country_liked`, `country_visited`
3. **Homepage CTA Effectiveness**: Compare `explore_cta_clicked` to subsequent page engagement
4. **User Retention**: Track returning users who perform `user_logged_in` events
5. **Search Behavior**: Analyze `country_search` patterns to understand user intent

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure to set these environment variables in your production environment:

```bash
VITE_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
