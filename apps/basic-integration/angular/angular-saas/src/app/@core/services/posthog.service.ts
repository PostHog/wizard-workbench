import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
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

  init(apiKey: string | undefined, options: Partial<PostHogConfig>): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    const missingVariable = !apiKey
      ? 'NG_APP_POSTHOG_PROJECT_TOKEN'
      : !options.api_host
        ? 'NG_APP_POSTHOG_HOST'
        : undefined;

    if (missingVariable) {
      if (!options.debug) {
        return;
      }

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    posthog.init(apiKey, options);
    this.initialized = true;
  }
}
