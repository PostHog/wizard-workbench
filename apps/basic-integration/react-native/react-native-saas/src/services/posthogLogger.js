import { posthog } from '../config/posthog';

export const posthogLogger = {
  info(message, attributes) {
    if (posthog) {
      posthog.logger.info(message, attributes);
    }
  },
};
