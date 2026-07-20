import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PosthogService {
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

  init(projectToken: string, options: Partial<PostHogConfig>): void {
    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      if (!projectToken) {
        throw new Error('NG_APP_POSTHOG_PROJECT_TOKEN must be configured');
      }

      posthog.init(projectToken, options);
      this.initialized = true;
    }
  }
}
