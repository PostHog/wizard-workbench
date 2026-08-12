import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import posthog from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  init(projectToken: string | undefined, host: string | undefined, production: boolean): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!projectToken || !host) {
      if (!production) {
        const variableName = !projectToken ? 'NG_APP_POSTHOG_PROJECT_TOKEN' : 'NG_APP_POSTHOG_HOST';
        throw new Error(
          `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
        );
      }
      return;
    }

    posthog.init(projectToken, { api_host: host });
    this.initialized = true;
  }

  get client(): typeof posthog | undefined {
    return this.initialized ? posthog : undefined;
  }
}
