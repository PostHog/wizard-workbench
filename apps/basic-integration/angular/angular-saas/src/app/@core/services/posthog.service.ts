import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!environment.posthogProjectToken || !environment.posthogHost) {
      if (!environment.production) {
        throw new Error(
          'NG_APP_POSTHOG_PROJECT_TOKEN or NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once the variables are configured',
        );
      }
      return;
    }

    const options: Partial<PostHogConfig> = {
      api_host: environment.posthogHost,
    };
    posthog.init(environment.posthogProjectToken, options);
    this.initialized = true;
  }

  get client(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }
    return new Proxy({} as typeof posthog, { get: () => () => undefined });
  }
}
