import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { PostHogConfig } from 'posthog-js';

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

  init(apiKey: string | undefined, apiHost: string | undefined, production: boolean): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!apiKey) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN', production);
      return;
    }

    if (!apiHost) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_HOST', production);
      return;
    }

    posthog.init(apiKey, { api_host: apiHost } satisfies Partial<PostHogConfig>);
    this.initialized = true;
  }

  private reportMissingConfiguration(variableName: string, production: boolean): void {
    if (!production) {
      console.error(
        new Error(
          `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
        ),
      );
    }
  }
}
