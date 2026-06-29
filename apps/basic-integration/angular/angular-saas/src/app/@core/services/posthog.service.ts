import { Injectable, NgZone } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private initialized = false;

  constructor(private readonly ngZone: NgZone) {}

  init(apiKey: string, options: Partial<PostHogConfig>): void {
    if (!this.initialized && apiKey) {
      this.ngZone.runOutsideAngular(() => {
        posthog.init(apiKey, options);
      });
      this.initialized = true;
    }
  }

  get posthog(): typeof posthog {
    if (this.initialized) {
      return posthog;
    }
    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }
}
