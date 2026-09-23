import { posthog } from '../config/posthog';

export const posthogLogger = {
  info(message, properties) {
    posthog?.logger?.info(message, properties);
  },
};
