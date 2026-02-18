import { Injectable, inject, PLATFORM_ID, DestroyRef, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import posthog, { PostHogConfig } from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private initialized = false;

  constructor() {
    this.initPostHog();
  }

  private initPostHog(): void {
    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      this.ngZone.runOutsideAngular(() => {
        posthog.init(environment.posthogKey, {
          api_host: environment.posthogHost,
          capture_exceptions: true,
          defaults: '2026-01-30',
        });
        this.initialized = true;
      });
    }
  }

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
}
