# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your TanStack Start SaaS application. This integration includes client-side event tracking via `@posthog/react`, server-side event capture using `posthog-node`, automatic exception tracking, and a reverse proxy configuration to avoid CORS issues. The implementation follows best practices with environment variables for configuration, singleton patterns for server-side clients, and `useRef` patterns to prevent duplicate event captures in React components.

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `invoice_created` | User successfully creates a new invoice | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User marks an invoice as paid | `src/routes/posts.$postId.tsx` |
| `invoice_viewed` | User views the invoice details page (top of conversion funnel) | `src/routes/posts.$postId.tsx` |
| `team_member_selected` | User selects a team member to view their profile | `src/routes/users.tsx` |
| `cta_clicked` | User clicks a CTA button on the home page | `src/routes/index.tsx` |
| `api_invoice_created` | Server-side event when invoice is created via API | `src/routes/api/invoices.ts` |
| `api_invoice_paid` | Server-side event when invoice is marked as paid via API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `api_invoice_deleted` | Server-side event when invoice is deleted via API | `src/routes/api/invoices.$invoiceId.ts` |
| `error_boundary_triggered` | An error was caught by the default error boundary | `src/components/DefaultCatchBoundary.tsx` |
| `invoice_error` | An error occurred while loading or viewing an invoice | `src/components/PostError.tsx` |
| `user_error` | An error occurred while loading or viewing a team member | `src/components/UserError.tsx` |

## Files Modified/Created

- **`src/utils/posthog-server.ts`** - Created server-side PostHog singleton client
- **`vite.config.ts`** - Added PostHog reverse proxy configuration
- **`src/routes/__root.tsx`** - Added PostHogProvider wrapper with exception tracking enabled
- **`src/routes/posts.index.tsx`** - Added invoice creation tracking
- **`src/routes/posts.$postId.tsx`** - Added invoice view and payment tracking
- **`src/routes/users.tsx`** - Added team member selection tracking
- **`src/routes/index.tsx`** - Added CTA click tracking
- **`src/routes/api/invoices.ts`** - Added server-side invoice creation tracking
- **`src/routes/api/invoices.$invoiceId.pay.ts`** - Added server-side payment tracking
- **`src/routes/api/invoices.$invoiceId.ts`** - Added server-side deletion tracking
- **`src/components/DefaultCatchBoundary.tsx`** - Added error boundary exception capture
- **`src/components/PostError.tsx`** - Added invoice error tracking
- **`src/components/UserError.tsx`** - Added user error tracking

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/238460/dashboard/1228088)

### Insights
- [Invoice Lifecycle Trends](https://us.posthog.com/project/238460/insights/L6wSgKSY) - Track invoice creation, viewing, and payment trends over time
- [Invoice Payment Conversion Funnel](https://us.posthog.com/project/238460/insights/biJXbnuI) - Measure conversion from invoice viewed to paid
- [CTA Performance by Button](https://us.posthog.com/project/238460/insights/kOdeXEeO) - Analyze which CTAs drive the most engagement
- [Error Tracking Overview](https://us.posthog.com/project/238460/insights/aJI8NBVE) - Monitor application errors and their frequency
- [Team Member Engagement](https://us.posthog.com/project/238460/insights/0wya2EZ3) - Track team member profile views

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
