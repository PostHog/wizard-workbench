<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode project. PostHog is initialized in `app/entry.client.tsx` using `posthog-js` and wrapped with `PostHogProvider` from `@posthog/react`, enabling the `usePostHog()` hook throughout the app. Pageviews are captured automatically by the SDK. Error tracking is active via `captureException` in the root `ErrorBoundary`. Users are identified by username on login and by user ID with username/email on signup. On logout, `posthog.reset()` clears the identity.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs into their account | `app/routes/login.tsx` |
| `user_logged_out` | User logs out from their account | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited, earning 50 points | `app/routes/countries.tsx` |
| `country_viewed` | User views a country detail page (top of engagement funnel) | `app/routes/country.tsx` |
| `country_searched` | User searches for a country by name | `app/routes/countries.tsx` |
| `region_filtered` | User filters countries by region | `app/routes/countries.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

- [New dashboard](https://us.posthog.com/project/2/dashboard) — create one named "Analytics basics"
- [Signup & login funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events","order":0},{"id":"user_logged_in","name":"user_logged_in","type":"events","order":1}]}) — Conversion from signup to login
- [Country engagement funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"country_viewed","name":"country_viewed","type":"events","order":0},{"id":"country_claimed","name":"country_claimed","type":"events","order":1}]}) — Conversion from viewing to claiming a country
- [Daily active users trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_in","name":"user_logged_in","type":"events","order":0}]}) — Login trend over time
- [Country actions trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"country_claimed","name":"country_claimed","type":"events","order":0},{"id":"country_liked","name":"country_liked","type":"events","order":1},{"id":"country_visited","name":"country_visited","type":"events","order":2}]}) — Claims, likes, and visits over time
- [User churn](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_out","name":"user_logged_out","type":"events","order":0}]}) — Logout trend to track churn signals

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
