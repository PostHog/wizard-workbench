import { Injectable, NgZone, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initPostHog();
    }
  }

  private initPostHog(): void {
    this.ngZone.runOutsideAngular(() => {
      posthog.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        defaults: '2026-01-30',
        capture_exceptions: true,
      });
    });
  }

  get client(): typeof posthog {
    return posthog;
  }
}
