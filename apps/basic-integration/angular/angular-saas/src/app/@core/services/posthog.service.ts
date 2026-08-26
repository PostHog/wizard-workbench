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

  init(
    projectToken: string | null,
    host: string | null,
    isDevelopment: boolean,
    options: Partial<PostHogConfig> = {},
  ): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    if (!this.isConfigured(projectToken, 'NG_APP_POSTHOG_PROJECT_TOKEN', isDevelopment)) {
      return;
    }

    if (!this.isConfigured(host, 'NG_APP_POSTHOG_HOST', isDevelopment)) {
      return;
    }

    posthog.init(projectToken, { api_host: host, ...options });
    this.initialized = true;
  }

  private isConfigured(value: string | null, variableName: string, isDevelopment: boolean): value is string {
    if (value) {
      return true;
    }

    if (isDevelopment) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }

    return false;
  }
}
