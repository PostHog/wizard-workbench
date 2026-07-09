import { Injectable, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { type PostHogConfig } from 'posthog-js';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  constructor() {
    this.init();
  }

  get client(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  captureException(error: unknown, additionalProperties?: Record<string, unknown>) {
    if (error instanceof Error) {
      this.client.captureException(error, additionalProperties);
      return;
    }

    this.client.captureException(new Error('Unknown client error'), {
      ...additionalProperties,
      original_error_type: typeof error,
    });
  }

  private init() {
    if (this.initialized || !isPlatformBrowser(this.platformId) || !environment.posthogKey) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      posthog.init(environment.posthogKey, this.getConfig());
      this.initialized = true;
    });
  }

  private getConfig(): Partial<PostHogConfig> {
    return {
      api_host: environment.posthogHost,
      defaults: '2026-05-30',
      capture_exceptions: true,
    };
  }
}
