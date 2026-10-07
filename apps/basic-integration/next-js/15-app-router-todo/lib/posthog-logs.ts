import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

let logProvider: LoggerProvider | undefined;

function getTodoLogProvider() {
  if (logProvider) {
    return logProvider;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
    return undefined;
  }

  if (!host) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
    return undefined;
  }

  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: {
      Authorization: `Bearer ${projectToken}`,
    },
  });

  logProvider = new LoggerProvider({
    processors: [new SimpleLogRecordProcessor({ exporter })],
  });

  return logProvider;
}

export async function logTodoMutation(action: 'created' | 'updated' | 'deleted') {
  const provider = getTodoLogProvider();
  if (!provider) {
    return;
  }

  try {
    provider.getLogger('posthog.todo.mutations').emit({
      severityText: 'INFO',
      body: `Todo ${action}`,
      attributes: {
        'todo.action': action,
      },
    });

    await provider.forceFlush();
  } catch {
    // Log delivery must not change the result of a Todo mutation.
  }
}
