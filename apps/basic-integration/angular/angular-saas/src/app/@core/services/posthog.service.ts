import { Injectable } from '@angular/core';
import posthog from 'posthog-js';

import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private initialized = false;

  get client(): typeof posthog | undefined {
    return this.initialized ? posthog : undefined;
  }

  init(apiKey: string | undefined, apiHost: string | undefined): void {
    if (!apiKey || !apiHost) {
      if (!environment.production) {
        if (!apiKey) {
          console.error(
            new Error(
              'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
            ),
          );
        }

        if (!apiHost) {
          console.error(
            new Error(
              'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
            ),
          );
        }
      }
      return;
    }

    if (!this.initialized) {
      posthog.init(apiKey, { api_host: apiHost });
      this.initialized = true;
    }
  }
}
