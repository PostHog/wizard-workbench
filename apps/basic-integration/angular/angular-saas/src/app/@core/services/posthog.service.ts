import { Injectable, NgZone, inject } from '@angular/core';
import posthog from 'posthog-js';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PosthogService {
  private readonly ngZone = inject(NgZone);
  private initialized = false;

  constructor() {
    this.init();
  }

  get client(): typeof posthog | undefined {
    return this.initialized ? posthog : undefined;
  }

  private init(): void {
    const { posthogKey, posthogHost } = environment;

    if (!posthogKey || !posthogHost) {
      if (!environment.production) {
        const missingVariable = posthogKey ? 'NG_APP_POSTHOG_HOST' : 'NG_APP_POSTHOG_PROJECT_TOKEN';
        throw new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
        );
      }
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        defaults: '2026-05-30',
      });
      this.initialized = true;
    });
  }
}
