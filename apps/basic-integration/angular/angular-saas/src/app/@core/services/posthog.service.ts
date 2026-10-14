import { Injectable } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class PostHogService {
  private initialized = false;

  init(apiKey: string | undefined, apiHost: string | undefined, production: boolean): void {
    if (this.initialized) {
      return;
    }

    if (!apiKey) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN', production);
      return;
    }

    if (!apiHost) {
      this.handleMissingConfiguration('NG_APP_POSTHOG_HOST', production);
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_exceptions: true,
      logs: {
        serviceName: 'angular-boilerplate-web',
        environment: production ? 'production' : 'development',
      },
    } satisfies Partial<PostHogConfig>);
    this.initialized = true;
  }

  /** Sends only purpose-written, structured browser logs through PostHog's native logger. */
  logInfo(message: string, attributes: Record<string, string | number | boolean>): void {
    if (this.initialized) {
      posthog.logger.info(message, attributes);
    }
  }

  get client(): typeof posthog | undefined {
    return this.initialized ? posthog : undefined;
  }

  private handleMissingConfiguration(variable: string, production: boolean): void {
    if (!production) {
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
      );
    }
  }
}
