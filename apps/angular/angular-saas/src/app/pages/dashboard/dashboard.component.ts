import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CredentialsService } from '@app/auth/services/credentials.service';
import { DataService } from '@app/@core/services/data.service';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { WelcomeBannerComponent } from './components/welcome-banner/welcome-banner.component';
import { ActivityFeedComponent } from './components/activity-feed/activity-feed.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { CreateProjectModalComponent } from '@app/shared/components/create-project-modal/create-project-modal.component';
import { AddMemberModalComponent } from '@app/shared/components/add-member-modal/add-member-modal.component';
import { PostHogService } from '@app/services/posthog.service';

interface StatItem {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  change?: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [StatsCardComponent, WelcomeBannerComponent, ActivityFeedComponent, QuickActionsComponent, CreateProjectModalComponent, AddMemberModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly credentialsService = inject(CredentialsService);
  private readonly dataService = inject(DataService);
  private readonly posthogService = inject(PostHogService);

  readonly showCreateProjectModal = signal(false);
  readonly showAddMemberModal = signal(false);

  readonly stats = computed<StatItem[]>(() => {
    const dataStats = this.dataService.stats();
    return [
      { label: 'Team Members', value: dataStats.totalMembers, icon: '👥', iconBg: 'rgba(59, 130, 246, 0.1)' },
      { label: 'Active Projects', value: dataStats.activeProjects, icon: '📁', iconBg: 'rgba(139, 92, 246, 0.1)' },
      { label: 'Total Projects', value: dataStats.totalProjects, icon: '📊', iconBg: 'rgba(16, 185, 129, 0.1)' },
      { label: 'Activities', value: dataStats.recentActivities, icon: '📋', iconBg: 'rgba(249, 115, 22, 0.1)' },
    ];
  });

  openCreateProjectModal() {
    this.posthogService.posthog.capture('create_project_modal_opened');
    this.showCreateProjectModal.set(true);
  }

  openAddMemberModal() {
    this.posthogService.posthog.capture('add_member_modal_opened');
    this.showAddMemberModal.set(true);
  }

  onModalClosed() {
    this.showCreateProjectModal.set(false);
    this.showAddMemberModal.set(false);
  }
}
