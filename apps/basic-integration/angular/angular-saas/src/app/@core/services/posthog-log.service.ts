import { inject, Injectable } from '@angular/core';

import { PostHogService } from './posthog.service';

@Injectable({ providedIn: 'root' })
export class PostHogLogService {
  private readonly posthogService = inject(PostHogService);

  loginCompleted(): void {
    this.info('authentication completed', { event: 'authentication.completed', outcome: 'success' });
  }

  projectCreated(status: string): void {
    this.info('project creation completed', { event: 'project.created', status });
  }

  teamMemberAdded(role: string): void {
    this.info('team member creation completed', { event: 'team_member.created', role });
  }

  private info(message: string, attributes: Record<string, string>): void {
    if (!this.posthogService.isInitialized) {
      return;
    }

    this.posthogService.posthog.logger.info(message, attributes);
  }
}
