import { posthog, isPostHogEnabled } from './posthog.js';

export const posthogAppLogger = {
  info(message, attributes) {
    if (isPostHogEnabled) {
      posthog.logger.info(message, attributes);
    }
  },
};
