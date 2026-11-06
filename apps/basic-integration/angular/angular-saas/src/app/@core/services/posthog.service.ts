import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get posthog(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(apiKey: string | undefined, apiHost: string | undefined, production: boolean): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    const missingVariables = [
      !apiKey && 'NG_APP_POSTHOG_PROJECT_TOKEN',
      !apiHost && 'NG_APP_POSTHOG_HOST',
    ].filter(Boolean) as string[];

    if (!apiKey || !apiHost) {
      if (!production) {
        missingVariables.forEach((variableName) => {
          console.error(
            new Error(
              `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
            ),
          );
        });
      }
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_exceptions: true,
      logs: {
        serviceName: 'angular-boilerplate-web',
        environment: production ? 'production' : 'development',
      },
    } satisfies Partial<PostHogConfig>);
    this.initialized = true;
  }
}
