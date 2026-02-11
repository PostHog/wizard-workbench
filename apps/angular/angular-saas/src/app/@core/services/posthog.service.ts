import { DestroyRef, inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private initialized = false;

  /**
   * The posthog instance. Use this directly to call posthog methods.
   * Returns the actual posthog instance on browser, or a no-op proxy on server.
   */
  get posthog(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }
    // Return a no-op proxy for SSR safety
    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  /**
   * Initialize PostHog with the given API key and options.
   * Runs outside of Angular zone to avoid performance issues with session recording.
   */
  init(apiKey: string, options: Partial<PostHogConfig>): void {
    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      this.ngZone.runOutsideAngular(() => {
        posthog.init(apiKey, {
          ...options,
          defaults: '2026-01-30',
        });
      });
      this.initialized = true;
    }
  }
}
