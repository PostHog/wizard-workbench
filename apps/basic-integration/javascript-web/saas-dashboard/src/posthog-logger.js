import { posthog } from './posthog.js';

export const posthogLogger = {
  info(message, attributes) {
    posthog?.logger.info(message, attributes);
  },
};
