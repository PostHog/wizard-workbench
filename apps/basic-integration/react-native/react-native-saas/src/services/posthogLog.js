import { posthog } from '../config/posthog';

export const posthogLog = {
  info(body, attributes) {
    if (posthog) {
      posthog.logger.info(body, attributes);
    }
  },
  warn(body, attributes) {
    if (posthog) {
      posthog.logger.warn(body, attributes);
    }
  },
};
