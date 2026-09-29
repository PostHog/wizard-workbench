import { Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

@Injectable({ providedIn: 'root' })
export class PostHogLogService {
  private readonly posthogService = inject(PostHogService);

  projectCreated(status: 'active' | 'completed' | 'on-hold', projectCount: number): void {
    this.posthogService.posthog.logger?.info?.('project_created', {
      project_status: status,
      project_count: projectCount,
    });
  }

  projectDeleted(projectCount: number): void {
    this.posthogService.posthog.logger?.info?.('project_deleted', { project_count: projectCount });
  }

  teamMemberAdded(role: 'admin' | 'member' | 'viewer', memberCount: number): void {
    this.posthogService.posthog.logger?.info?.('team_member_added', {
      member_role: role,
      member_count: memberCount,
    });
  }
}
