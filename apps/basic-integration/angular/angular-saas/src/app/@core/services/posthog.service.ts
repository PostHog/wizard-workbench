import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) return;

    const token = environment.posthogProjectToken;
    const host = environment.posthogHost;
    if (!token) {
      if (!environment.production) {
        throw new Error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }
    if (!host) {
      if (!environment.production) {
        throw new Error(
          'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
        );
      }
      return;
    }

    posthog.init(token, { api_host: host } satisfies Partial<PostHogConfig>);
    this.initialized = true;
  }

  get client(): typeof posthog {
    return posthog;
  }
}
