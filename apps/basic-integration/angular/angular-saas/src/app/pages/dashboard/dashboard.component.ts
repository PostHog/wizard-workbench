import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth/services/credentials.service';
import { DataService } from '@app/@core/services/data.service';
import { PosthogService } from '@core/services/posthog.service';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { WelcomeBannerComponent } from './components/welcome-banner/welcome-banner.component';
import { ActivityFeedComponent } from './components/activity-feed/activity-feed.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { CreateProjectModalComponent } from '@app/shared/components/create-project-modal/create-project-modal.component';
import { AddMemberModalComponent } from '@app/shared/components/add-member-modal/add-member-modal.component';

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
export class DashboardComponent implements OnInit {
  readonly credentialsService = inject(CredentialsService);
  private readonly dataService = inject(DataService);
  private readonly posthogService = inject(PosthogService);

  readonly showCreateProjectModal = signal(false);
  readonly showAddMemberModal = signal(false);

  ngOnInit() {
    this.posthogService.posthog.capture('dashboard_viewed');
  }

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
    this.showCreateProjectModal.set(true);
  }

  openAddMemberModal() {
    this.showAddMemberModal.set(true);
  }

  onModalClosed() {
    this.showCreateProjectModal.set(false);
    this.showAddMemberModal.set(false);
  }
}
