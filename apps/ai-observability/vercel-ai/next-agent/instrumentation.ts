import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PostHogSpanProcessor } from '@posthog/ai/otel';

export function register() {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'next-agent',
    }),
    spanProcessors: [
      new PostHogSpanProcessor({
        apiKey: process.env.POSTHOG_API_KEY!,
        host: process.env.POSTHOG_HOST!,
      }),
    ],
  });

  sdk.start();
}
