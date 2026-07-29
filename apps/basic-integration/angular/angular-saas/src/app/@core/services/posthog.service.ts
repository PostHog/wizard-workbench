import { ErrorHandler, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PosthogService {
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

  init(apiKey: string | undefined, options: Partial<PostHogConfig>, production = false): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) return;

    if (!apiKey) {
      if (!production) {
        throw new Error(
          'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }

    posthog.init(apiKey, options);
    this.initialized = true;
  }
}

@Injectable({ providedIn: 'root' })
export class PosthogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PosthogService);

  handleError(error: unknown): void {
    if (error instanceof Error) {
      this.posthogService.client.captureException(error);
    } else {
      this.posthogService.client.captureException(new Error(String(error)));
    }

    console.error(error);
  }
}
