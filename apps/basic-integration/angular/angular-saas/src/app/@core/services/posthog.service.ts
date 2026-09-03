import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get posthog(): typeof posthog | undefined {
    return this.initialized && isPlatformBrowser(this.platformId) ? posthog : undefined;
  }

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!environment.posthogProjectToken) {
      if (!environment.production) {
        throw new Error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }

    if (!environment.posthogHost) {
      if (!environment.production) {
        throw new Error(
          'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
        );
      }
      return;
    }

    const config: Partial<PostHogConfig> = {
      api_host: environment.posthogHost,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
    };

    posthog.init(environment.posthogProjectToken, config);
    this.initialized = true;
  }
}
