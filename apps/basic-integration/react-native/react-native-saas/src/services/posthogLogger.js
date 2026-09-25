import { posthog } from '../config/posthog';

// This logger is intentionally isolated so only purpose-written integration
// lines are exported to PostHog Logs; existing application logging stays local.
export const posthogLogger = {
  info(message, attributes) {
    posthog?.logger.info(message, attributes);
  },
};
