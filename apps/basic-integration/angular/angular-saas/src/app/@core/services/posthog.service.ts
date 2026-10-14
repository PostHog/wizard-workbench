import { Injectable, isDevMode } from '@angular/core';
import posthog from 'posthog-js';

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

  init(apiKey: string | undefined, host: string | undefined, production: boolean): void {
    if (!apiKey) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_PROJECT_TOKEN');
      return;
    }

    if (!host) {
      this.reportMissingConfiguration('NG_APP_POSTHOG_HOST');
      return;
    }

    if (this.initialized) {
      return;
    }

    posthog.init(apiKey, {
      api_host: host,
      capture_pageview: 'history_change',
      logs: {
        serviceName: 'angular-boilerplate-web',
        environment: production ? 'production' : 'development',
      },
    });
    this.initialized = true;
    this.logInfo('application initialized', {
      event: 'application.initialized',
      runtime: 'browser',
    });
  }

  logAuthenticationSucceeded(rememberMe: boolean, isMobile: boolean): void {
    this.logInfo('authentication succeeded', {
      event: 'authentication.succeeded',
      authentication_method: 'password',
      remember_me: rememberMe,
      is_mobile: isMobile,
    });
  }

  private logInfo(message: string, attributes: Record<string, string | boolean>): void {
    if (this.initialized) {
      posthog.logger.info(message, attributes);
    }
  }

  private reportMissingConfiguration(variableName: string): void {
    if (isDevMode()) {
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}
