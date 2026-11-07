import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get isInitialized(): boolean {
    return isPlatformBrowser(this.platformId) && this.initialized;
  }

  get posthog(): typeof posthog {
    if (this.isInitialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(apiKey: string | undefined, options: Partial<PostHogConfig>): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!apiKey) {
      if (!ngDevMode) {
        return;
      }

      console.error(
        new Error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        ),
      );
      return;
    }

    posthog.init(apiKey, options);
    this.initialized = true;
  }
}
