import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private initialized = false;

  /**
   * The posthog instance. Returns the actual posthog instance on browser,
   * or a no-op proxy on server (SSR safety).
   */
  get posthog(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }
    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(apiKey: string, options: Partial<PostHogConfig>): void {
    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      this.ngZone.runOutsideAngular(() => {
        posthog.init(apiKey, options);
      });
      this.initialized = true;
    }
  }
}
