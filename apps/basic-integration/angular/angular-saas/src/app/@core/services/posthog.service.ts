import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get posthog(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(projectToken: string | undefined, host: string | undefined, production: boolean): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!projectToken) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN', production);
      return;
    }

    if (!host) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_HOST', production);
      return;
    }

    const options: Partial<PostHogConfig> = { api_host: host };
    posthog.init(projectToken, options);
    this.initialized = true;
  }

  private handleMissingConfiguration(variableName: string, production: boolean): void {
    if (!production) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
