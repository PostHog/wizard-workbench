import { Injectable, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { PostHogConfig } from 'posthog-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private initialized = false;

  get posthog(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }
    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(): void {
    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      this.ngZone.runOutsideAngular(() => {
        posthog.init(environment.posthogKey, {
          api_host: environment.posthogHost,
          defaults: '2026-01-30',
          capture_exceptions: true,
        });
      });
      this.initialized = true;
    }
  }
}
