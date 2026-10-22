import { Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

type ProjectStatus = 'active' | 'on-hold' | 'completed';

@Injectable({
  providedIn: 'root',
})
export class PostHogLogService {
  private readonly posthogService = inject(PostHogService);

  authenticationCompleted(): void {
    this.posthogService.posthog.logger?.info?.('authentication completed', {
      event: 'authentication_completed',
      authentication_method: 'demo_credentials',
    });
  }

  authenticationEnded(): void {
    this.posthogService.posthog.logger?.info?.('authentication ended', {
      event: 'authentication_ended',
    });
  }

  projectCreated(projectStatus: ProjectStatus): void {
    this.posthogService.posthog.logger?.info?.('project created', {
      event: 'project_created',
      project_status: projectStatus,
    });
  }
}
