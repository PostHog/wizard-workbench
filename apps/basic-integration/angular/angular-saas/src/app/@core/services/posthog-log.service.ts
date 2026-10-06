import { Injectable, inject } from '@angular/core';

import { PostHogService } from './posthog.service';

/** Sends only explicitly selected application logs to PostHog. */
@Injectable({ providedIn: 'root' })
export class PostHogLogService {
  private readonly posthogService = inject(PostHogService);

  applicationInitialized(version: string): void {
    if (!this.posthogService.ready) {
      return;
    }

    this.posthogService.posthog.logger.info('application initialized', {
      application_version: version,
    });
  }

  loginCompleted(): void {
    if (!this.posthogService.ready) {
      return;
    }

    this.posthogService.posthog.logger.info('authentication completed');
  }

  projectCreated(status: 'active' | 'on-hold' | 'completed'): void {
    if (!this.posthogService.ready) {
      return;
    }

    this.posthogService.posthog.logger.info('project creation completed', {
      project_status: status,
    });
  }
}
