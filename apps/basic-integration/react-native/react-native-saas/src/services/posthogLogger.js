import { posthog } from '../config/posthog';

export const posthogLogs = {
  info(message, attributes) {
    if (posthog) {
      posthog.logger.info(message, attributes);
    }
  },

  error(message, attributes) {
    if (posthog) {
      posthog.logger.error(message, attributes);
    }
  },
};
