import { Injectable, inject, isDevMode, NgZone } from '@angular/core';
import posthog from 'posthog-js';
import { environment } from '@env/environment';

const noOp = () => undefined;
const noOpLogger = new Proxy({}, { get: () => noOp });
const noOpPosthog = new Proxy({}, { get: (_, property) => (property === 'logger' ? noOpLogger : noOp) }) as typeof posthog;

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly ngZone = inject(NgZone);
  private readonly isConfigured = Boolean(environment.posthogKey && environment.posthogHost);

  constructor() {
    this.initPostHog();
  }

  private initPostHog(): void {
    if (!this.isConfigured) {
      if (isDevMode()) {
        const missingVariable = environment.posthogKey
          ? 'NG_APP_POSTHOG_HOST'
          : 'NG_APP_POSTHOG_PROJECT_TOKEN';

        throw new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
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

  get posthog(): typeof posthog {
    return this.isConfigured ? posthog : noOpPosthog;
  }
}
