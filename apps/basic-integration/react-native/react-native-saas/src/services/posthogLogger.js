import { posthog } from '../config/posthog';

export const posthogLogger = {
  info(message, attributes) {
    posthog?.logger.info(message, attributes);
  },
};
