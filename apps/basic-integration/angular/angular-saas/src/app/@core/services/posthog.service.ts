import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import posthog from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  init(apiKey: string, apiHost: string, production: boolean): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!apiKey || !apiHost) {
      if (!production) {
        const missingVariable = apiKey ? 'NG_APP_POSTHOG_HOST' : 'NG_APP_POSTHOG_PROJECT_TOKEN';
        throw new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
        );
      }
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      defaults: '2026-08-30',
      capture_exceptions: true,
      logs: {
        serviceName: 'angular-boilerplate-web',
        environment: production ? 'production' : 'development',
      },
    });
    this.initialized = true;
  }

  get posthog(): typeof posthog {
    if (this.initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }
}
