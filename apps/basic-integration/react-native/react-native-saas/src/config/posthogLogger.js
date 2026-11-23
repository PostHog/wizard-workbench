import { posthog } from './posthog';

export function logPostHogInfo(message, attributes) {
  if (posthog) {
    posthog.logger.info(message, attributes);
  }
}
