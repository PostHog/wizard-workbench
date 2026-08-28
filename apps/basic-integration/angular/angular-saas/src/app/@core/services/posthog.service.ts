import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get client(): typeof posthog | undefined {
    return this.initialized && isPlatformBrowser(this.platformId) ? posthog : undefined;
  }

  init(apiKey: string | undefined, options: Partial<PostHogConfig>, production: boolean): void {
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

    posthog.init(apiKey, options);
    this.initialized = true;
  }
}
