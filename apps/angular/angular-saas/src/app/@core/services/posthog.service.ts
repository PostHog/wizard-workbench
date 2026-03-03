import { Injectable, NgZone, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        posthog.init(environment.posthogKey, {
          api_host: environment.posthogHost,
          defaults: '2026-01-30',
        });
      });
    }
  }

  get posthog(): typeof posthog {
    if (isPlatformBrowser(this.platformId)) {
      return posthog;
    }
    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }
}
