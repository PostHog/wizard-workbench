import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get instance(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(apiKey: string, options: Partial<PostHogConfig>): void {
    if (!apiKey || !isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      posthog.init(apiKey, options);
      this.initialized = true;
    });
  }
}
