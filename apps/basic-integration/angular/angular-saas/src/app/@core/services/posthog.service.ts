import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import posthog from 'posthog-js';

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

  get isInitialized(): boolean {
    return isPlatformBrowser(this.platformId) && this.initialized;
  }

  init(projectToken: string | undefined, host: string | undefined, production: boolean, version: string): void {
    if (!projectToken) {
      this.throwConfigurationError('NG_APP_POSTHOG_PROJECT_TOKEN', production);
      return;
    }

    if (!host) {
      this.throwConfigurationError('NG_APP_POSTHOG_HOST', production);
      return;
    }

    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      posthog.init(projectToken, {
        api_host: host,
        capture_exceptions: true,
        logs: {
          serviceName: 'angular-boilerplate-web',
          environment: production ? 'production' : 'development',
          serviceVersion: version,
        },
      });
      this.initialized = true;
    }
  }

  private throwConfigurationError(variable: string, production: boolean): void {
    if (!production) {
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
      );
    }
  }
}
