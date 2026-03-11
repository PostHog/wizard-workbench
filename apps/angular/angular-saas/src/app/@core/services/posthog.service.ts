import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { PostHogConfig } from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private initialized = false;

  /**
   * The posthog instance. Returns a no-op proxy on the server for SSR safety.
   */
  get posthog(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }
    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }
    this.ngZone.runOutsideAngular(() => {
      posthog.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        defaults: '2026-01-30',
        capture_exceptions: true,
      } as Partial<PostHogConfig>);
      this.initialized = true;
    });
  }
}
