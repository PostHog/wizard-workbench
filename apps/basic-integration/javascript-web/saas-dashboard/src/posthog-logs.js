import { isPostHogConfigured, posthog } from './posthog.js';

const posthogLogger = {
  info(message, attributes) {
    if (isPostHogConfigured) {
      posthog.logger.info(message, attributes);
    }
  },
};

export { posthogLogger };
