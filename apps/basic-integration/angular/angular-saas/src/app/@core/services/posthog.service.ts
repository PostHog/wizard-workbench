import { Injectable } from '@angular/core';
import posthog from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private initialized = false;

  get posthog(): typeof posthog | undefined {
    return this.initialized ? posthog : undefined;
  }

  init(apiKey: string | undefined, apiHost: string | undefined, production: boolean): void {
    if (this.initialized) {
      return;
    }

    if (!apiKey) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN', production);
      return;
    }

    if (!apiHost) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_HOST', production);
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: 'history_change',
      logs: {
        serviceName: 'angular-saas-web',
        environment: production ? 'production' : 'development',
      },
    });
    this.initialized = true;
  }

  private reportMissingConfiguration(variableName: string, production: boolean): void {
    if (!production) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
