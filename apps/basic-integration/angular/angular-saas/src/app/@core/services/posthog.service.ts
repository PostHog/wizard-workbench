import { Injectable } from '@angular/core';
import posthog from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  private initialized = false;

  get posthog(): typeof posthog {
    if (this.initialized) {
      return posthog;
    }

    return new Proxy({} as typeof posthog, {
      get: () => () => undefined,
    });
  }

  init(): void {
    if (this.initialized) {
      return;
    }

    if (!environment.posthogProjectToken) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN');
      return;
    }

    if (!environment.posthogHost) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_HOST');
      return;
    }

    posthog.init(environment.posthogProjectToken, {
      api_host: environment.posthogHost,
      capture_exceptions: true,
      logs: {
        serviceName: 'angular-boilerplate-web',
        environment: environment.production ? 'production' : 'development',
      },
    });
    this.initialized = true;
  }

  private handleMissingConfiguration(variableName: string): void {
    if (!environment.production) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
