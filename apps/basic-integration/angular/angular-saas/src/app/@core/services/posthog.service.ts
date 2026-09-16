import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import posthog, { type PostHogConfig } from 'posthog-js';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get client(): typeof posthog {
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

    if (!apiKey) {
      if (!production) {
        throw new Error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }

    if (!apiHost) {
      if (!production) {
        throw new Error(
          'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
        );
      }
      return;
    }

    const options: Partial<PostHogConfig> = {
      api_host: apiHost,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
    };

    posthog.init(apiKey, options);
    this.initialized = true;
  }
}
