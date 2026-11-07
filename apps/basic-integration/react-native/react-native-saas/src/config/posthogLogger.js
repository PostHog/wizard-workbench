import { posthog } from './posthog';

function logWorkspaceOperation(message, attributes) {
  if (!posthog) {
    return;
  }

  try {
    posthog.logger.info(message, attributes);
  } catch {}
}

export { logWorkspaceOperation };
