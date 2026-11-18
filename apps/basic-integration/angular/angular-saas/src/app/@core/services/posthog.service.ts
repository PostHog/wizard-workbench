import { Injectable, NgZone, inject } from '@angular/core';
import posthog from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly ngZone = inject(NgZone);
  private initialized = false;

  constructor() {
    this.init();
  }

  get client(): typeof posthog | null {
    return this.initialized ? posthog : null;
  }

  logInfo(message: string, attributes: Record<string, string | number | boolean> = {}): void {
    this.client?.logger.info(message, attributes);
  }

  private init(): void {
    if (!environment.posthogKey || !environment.posthogHost) {
      if (!environment.production) {
        if (!environment.posthogKey) {
          console.error(
            'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
          );
        }

        if (!environment.posthogHost) {
          console.error(
            'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
          );
        }
      }

      return;
    }

    this.ngZone.runOutsideAngular(() => {
      posthog.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        defaults: '2026-08-30',
        logs: {
          serviceName: 'angular-boilerplate-web',
          environment: environment.production ? 'production' : 'development',
        },
      });
      this.initialized = true;
      this.logInfo('posthog_log_capture_initialized', {
        application_environment: environment.production ? 'production' : 'development',
      });
    });
  }
}
