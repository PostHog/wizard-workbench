import { Injectable, inject } from '@angular/core';
import { PosthogService } from './posthog.service';

@Injectable({ providedIn: 'root' })
export class PosthogLogsService {
  private readonly posthogService = inject(PosthogService);

  authenticationSucceeded(): void {
    this.posthogService.posthog.logger.info('authentication completed', {
      event: 'authentication.completed',
      authentication_method: 'password',
      outcome: 'succeeded',
    });
  }

  projectCreated(status: 'active' | 'on-hold' | 'completed'): void {
    this.posthogService.posthog.logger.info('project creation completed', {
      event: 'project.creation.completed',
      project_status: status,
    });
  }

  sessionsRevoked(scope: 'single' | 'all_other'): void {
    this.posthogService.posthog.logger.warn('session revocation completed', {
      event: 'session.revocation.completed',
      revoke_scope: scope,
    });
  }
}
