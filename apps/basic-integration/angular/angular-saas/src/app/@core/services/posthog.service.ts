import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import posthog from 'posthog-js';

@Injectable({
  providedIn: 'root',
})
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
      this.handleMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN', production);
      return;
    }

    if (!apiHost) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_HOST', production);
      return;
    }

    posthog.init(apiKey, { api_host: apiHost });
    this.initialized = true;
  }

  private handleMissingConfiguration(variableName: string, production: boolean): void {
    if (!production) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
