import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly noopPosthog = new Proxy({} as typeof posthog, {
    get: () => () => undefined,
  });
  private initialized = false;

  get posthog(): typeof posthog {
    return isPlatformBrowser(this.platformId) && this.initialized ? posthog : this.noopPosthog;
  }

  init(apiKey: string | undefined, apiHost: string | undefined): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!apiKey) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN');
      return;
    }

    if (!apiHost) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_HOST');
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
    } satisfies Partial<PostHogConfig>);
    this.initialized = true;
  }

  private handleMissingConfiguration(variableName: string): void {
    if (!environment.production) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
