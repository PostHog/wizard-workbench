import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private readonly _platformId = inject(PLATFORM_ID);
  private _initialized = false;

  get posthog(): typeof posthog {
    if (isPlatformBrowser(this._platformId) && this._initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(apiKey: string | undefined, options: Partial<PostHogConfig>): void {
    if (!isPlatformBrowser(this._platformId) || this._initialized) {
      return;
    }

    if (!apiKey) {
      if (!options.debug) {
        return;
      }

      throw new Error(
        'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
      );
    }

    posthog.init(apiKey, options);
    this._initialized = true;
  }
}
