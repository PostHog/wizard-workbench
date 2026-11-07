import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, NgZone, PLATFORM_ID } from '@angular/core';
import posthog from 'posthog-js';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
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
    apiKey: string | undefined,
    apiHost: string | undefined,
    production: boolean,
    serviceVersion: string,
  ): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    const missingVariable = !apiKey ? 'NG_APP_POSTHOG_PROJECT_TOKEN' : !apiHost ? 'NG_APP_POSTHOG_HOST' : null;
    if (missingVariable) {
      if (!production) {
        console.error(
          new Error(
            `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
          ),
        );
      }
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      posthog.init(apiKey, {
        api_host: apiHost,
        defaults: '2026-08-30',
        logs: {
          serviceName: 'angular-boilerplate-web',
          environment: production ? 'production' : 'development',
          serviceVersion,
        },
      });
      this.initialized = true;
    });
  }
}
