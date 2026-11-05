import { Injectable, NgZone, inject } from '@angular/core';
import posthog from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly ngZone = inject(NgZone);
  private readonly disabledClient = new Proxy({} as typeof posthog, {
    get: () => () => undefined,
  });
  private readonly disabledLogger = new Proxy({} as typeof posthog.logger, {
    get: () => () => undefined,
  });

  constructor() {
    if (!environment.posthogKey) {
      if (!environment.production) {
        console.error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      posthog.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        logs: {
          serviceName: 'angular-boilerplate-web',
          environment: environment.production ? 'production' : 'development',
          serviceVersion: environment.version,
        },
      });
    });
  }

  get client(): typeof posthog {
    return environment.posthogKey ? posthog : this.disabledClient;
  }

  get logger(): typeof posthog.logger {
    return environment.posthogKey ? posthog.logger : this.disabledLogger;
  }
}
