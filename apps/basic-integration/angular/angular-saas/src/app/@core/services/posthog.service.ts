import { Injectable } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private initialized = false;

  get posthog(): typeof posthog {
    if (this.initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  get ready(): boolean {
    return this.initialized;
  }

  init(apiKey: string | undefined, host: string | undefined, production: boolean, version: string): void {
    if (this.initialized) {
      return;
    }

    if (!apiKey) {
      if (!production) {
        console.error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }

    if (!host) {
      if (!production) {
        console.error(
          'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
        );
      }
      return;
    }

    posthog.init(apiKey, {
      api_host: host,
      logs: {
        serviceName: 'angular-boilerplate-web',
        environment: production ? 'production' : 'development',
        serviceVersion: version,
      },
    } satisfies Partial<PostHogConfig>);
    this.initialized = true;
  }
}
