import { Injectable } from '@angular/core';
import posthog from 'posthog-js';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PostHogService {
  constructor() {
    this._init();
  }

  capture(eventName: string, properties?: Record<string, any>): void {
    posthog.capture(eventName, properties);
  }

  identify(userId: string, properties?: Record<string, any>): void {
    posthog.identify(userId, properties);
  }

  reset(): void {
    posthog.reset();
  }

  getDistinctId(): string | undefined {
    return posthog.get_distinct_id();
  }

  isFeatureEnabled(flag: string): boolean {
    return posthog.isFeatureEnabled(flag);
  }

  getFeatureFlagPayload(flag: string): any {
    return posthog.getFeatureFlagPayload(flag);
  }

  private _init(): void {
    if (!environment.posthog_token || !environment.posthog_host) {
      console.warn('PostHog configuration missing');
      return;
    }

    posthog.init(environment.posthog_token, {
      api_host: environment.posthog_host,
      person_profiles: 'always',
    });
  }
}
