import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler, inject, Injectable, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  init(apiKey: string | undefined, host: string | undefined, production: boolean): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) return;

    if (!apiKey) {
      if (!production) {
        throw new Error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }

    if (!host) {
      if (!production) {
        throw new Error(
          'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
        );
      }
      return;
    }

    const options: Partial<PostHogConfig> = { api_host: host };
    posthog.init(apiKey, options);
    this.initialized = true;
  }

  get client(): typeof posthog {
    return this.initialized ? posthog : new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }
}

@Injectable({ providedIn: 'root' })
export class PosthogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PosthogService);

  handleError(error: unknown): void {
    this.posthogService.client.captureException(error);
    console.error(error);
  }
}
