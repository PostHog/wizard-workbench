import { Injectable } from '@angular/core';
import posthog from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private initialized = false;

  get client(): typeof posthog | undefined {
    return this.initialized ? posthog : undefined;
  }

  init(apiKey: string | undefined, host: string | undefined, production: boolean): void {
    if (!apiKey) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN', production);
      return;
    }

    if (!host) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_HOST', production);
      return;
    }

    if (!this.initialized) {
      posthog.init(apiKey, {
        api_host: host,
        capture_pageview: 'history_change',
        capture_exceptions: {
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
          capture_console_errors: false,
        },
      });
      this.initialized = true;
    }
  }

  private reportMissingConfiguration(variableName: string, production: boolean): void {
    if (!production) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
