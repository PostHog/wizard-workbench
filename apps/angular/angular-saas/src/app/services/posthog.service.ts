import { Injectable, NgZone, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import posthog from 'posthog-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);
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

  /**
   * The posthog instance. Returns no-op proxy when not in browser.
   */
  get posthog(): typeof posthog {
    if (isPlatformBrowser(this.platformId)) {
      return posthog;
    }
    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }
}
