import { isPostHogConfigured, posthog } from './posthog.js';

export function logPostHogOperation(message, attributes) {
  if (isPostHogConfigured) posthog.logger.info(message, attributes);
}
