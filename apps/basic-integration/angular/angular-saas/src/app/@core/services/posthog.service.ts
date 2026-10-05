import { isDevMode, Injectable } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
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

  get isInitialized(): boolean {
    return this.initialized;
  }

  init(apiKey: string | undefined, apiHost: string | undefined): void {
    if (this.initialized) {
      return;
    }

    if (!apiKey) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN');
      return;
    }

    if (!apiHost) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_HOST');
      return;
    }

    const options: Partial<PostHogConfig> = {
      api_host: apiHost,
      logs: {
        serviceName: 'angular-boilerplate-web',
        environment: isDevMode() ? 'development' : 'production',
      },
    };

    posthog.init(apiKey, options);
    this.initialized = true;
  }

  private reportMissingConfiguration(variableName: string): void {
    if (isDevMode()) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
