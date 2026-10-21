import posthog, { isPostHogConfigured } from './posthog.js';

const LOG_SOURCE = 'trackflow_web';

export const appLogger = {
  info(message, attributes) {
    if (isPostHogConfigured) {
      posthog.logger.info(message, { source: LOG_SOURCE, ...attributes });
    }
  },
};
