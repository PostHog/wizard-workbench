import { Injectable } from '@angular/core';
import posthog, { PostHogConfig } from 'posthog-js';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  private initialized = false;

  get client(): typeof posthog | undefined {
    return this.initialized ? posthog : undefined;
  }

  init(apiKey: string | undefined, options: Partial<PostHogConfig>, production: boolean): void {
    if (this.initialized) {
      return;
    }

    if (!apiKey || !options.api_host) {
      if (!production) {
        const variableName = apiKey ? 'NG_APP_POSTHOG_HOST' : 'NG_APP_POSTHOG_PROJECT_TOKEN';
        throw new Error(
          `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
        );
      }
      return;
    }

    posthog.init(apiKey, options);
    this.initialized = true;
  }
}
