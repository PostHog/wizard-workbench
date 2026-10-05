import { PostHog } from 'posthog-node';

type TodoEvent = 'todo_created' | 'todo_completion_changed' | 'todo_deleted';

export async function captureTodoEvent(
  event: TodoEvent,
  properties?: Record<string, boolean>,
) {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = projectToken
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    return;
  }

  const posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    personProfiles: 'never',
  });

  posthog.capture({ event, properties });
  await posthog.shutdown();
}
