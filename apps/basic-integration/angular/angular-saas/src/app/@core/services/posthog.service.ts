import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
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

  init(
    apiKey?: string,
    apiHost?: string,
    logService?: { serviceName: string; environment: string; serviceVersion?: string },
  ): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    const missingVariable = !apiKey
      ? 'NG_APP_POSTHOG_PROJECT_TOKEN'
      : !apiHost
        ? 'NG_APP_POSTHOG_HOST'
        : undefined;

    if (missingVariable) {
      if (!this.isProduction()) {
        console.error(
          new Error(
            `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
          ),
        );
      }
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      logs: logService,
    });
    this.initialized = true;
  }

  private isProduction(): boolean {
    return typeof ngDevMode === 'undefined' || !ngDevMode;
  }
}
