import { Injectable, inject } from '@angular/core';

import { PostHogService } from './posthog.service';

@Injectable({
  providedIn: 'root',
})
export class PostHogLogService {
  private readonly posthogService = inject(PostHogService);

  private get logger() {
    return this.posthogService.isInitialized ? this.posthogService.posthog.logger : null;
  }

  applicationInitialized(version: string, environment: 'development' | 'production'): void {
    this.logger?.info('Angular application initialized', {
      deployment_environment: environment,
      version,
    });
  }

  localizationInitialized(languageCount: number): void {
    this.logger?.info('Application localization initialized', {
      supported_language_count: languageCount,
    });
  }

  socketConnectionRequested(): void {
    this.logger?.info('Application socket connection requested');
  }
}
