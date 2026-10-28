import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  get client(): typeof posthog {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      return posthog;
    }

    const noOp = () => undefined;
    const logger = new Proxy({} as typeof posthog.logger, { get: () => noOp });

    return new Proxy({ logger } as unknown as typeof posthog, {
      get: (target, property) => (property === 'logger' ? target.logger : noOp),
    });
  }

  init(projectToken: string | undefined, host: string | undefined, production: boolean): void {
    if (!projectToken) {
      if (!production) {
        throw new Error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }

    if (!host) {
      if (!production) {
        throw new Error(
          'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
        );
      }
      return;
    }

    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      posthog.init(projectToken, {
        api_host: host,
        capture_exceptions: {
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
          capture_console_errors: false,
        },
        logs: {
          serviceName: 'angular-boilerplate',
          environment: production ? 'production' : 'development',
        },
      } satisfies Partial<PostHogConfig>);
      this.initialized = true;
    }
  }
}
