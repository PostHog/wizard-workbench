import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get client(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(
    projectToken: string | undefined,
    host: string | undefined,
    production: boolean,
    serviceVersion: string,
  ): void {
    if (!projectToken) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN', production);
      return;
    }

    if (!host) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_HOST', production);
      return;
    }

    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      const config: Partial<PostHogConfig> = {
        api_host: host,
        logs: {
          serviceName: 'angular-boilerplate-web',
          environment: production ? 'production' : 'development',
          serviceVersion,
        },
      };
      posthog.init(projectToken, config);
      this.initialized = true;
    }
  }

  /** Emits only purpose-built application lifecycle records to PostHog Logs. */
  logInfo(message: string, attributes: Record<string, string | number | boolean>): void {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      posthog.logger.info(message, attributes);
    }
  }

  private handleMissingConfiguration(variableName: string, production: boolean): void {
    if (!production) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
