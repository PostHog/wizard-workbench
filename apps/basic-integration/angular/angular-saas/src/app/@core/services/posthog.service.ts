import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get isInitialized(): boolean {
    return this.initialized;
  }

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
    logs?: { serviceName: string; environment: string; serviceVersion: string },
  ): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!apiKey) {
      if (!ngDevMode) {
        return;
      }

      console.error(
        'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
      );
      return;
    }

    const config: Partial<PostHogConfig> = {
      ...(apiHost ? { api_host: apiHost } : {}),
      ...(logs ? { logs } : {}),
    };
    posthog.init(apiKey, config);
    this.initialized = true;
  }
}
