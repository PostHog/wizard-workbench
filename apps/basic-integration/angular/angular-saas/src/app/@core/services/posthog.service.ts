import { Injectable, NgZone, inject } from '@angular/core';
import posthog from 'posthog-js';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PosthogService {
  private readonly ngZone = inject(NgZone);
  private initialized = false;

  init(): void {
    if (this.initialized) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      posthog.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        defaults: '2026-05-30',
        capture_exceptions: true,
      });
      this.initialized = true;
    });
  }

  identify(userId: string, properties: Record<string, unknown>): void {
    posthog.identify(userId, properties);
  }

  capture(event: string, properties?: Record<string, unknown>): void {
    posthog.capture(event, properties);
  }

  captureException(error: Error): void {
    posthog.captureException(error);
  }

  reset(): void {
    posthog.reset();
  }
}
