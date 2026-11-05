import { posthog } from './posthog.js';

const logger = posthog?.logger;

export function logApplicationStarted(hasAuthenticatedSession) {
  logger?.info('application started', {
    event: 'application_started',
    has_authenticated_session: hasAuthenticatedSession,
  });
}

export function logAuthenticationCompleted(role) {
  logger?.info('authentication completed', {
    event: 'authentication_completed',
    outcome: 'success',
    role,
  });
}

export function logProjectCreated(hasDescription) {
  logger?.info('project created', {
    event: 'project_created',
    outcome: 'success',
    has_description: hasDescription,
  });
}
