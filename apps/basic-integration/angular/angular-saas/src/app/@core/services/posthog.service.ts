import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
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

  init(apiKey: string | undefined, apiHost: string | undefined, debug: boolean): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!apiKey) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN', debug);
      return;
    }

    if (!apiHost) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_HOST', debug);
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      debug,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
    });
    this.initialized = true;
  }

  private handleMissingConfiguration(variableName: string, debug: boolean): void {
    if (debug) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
