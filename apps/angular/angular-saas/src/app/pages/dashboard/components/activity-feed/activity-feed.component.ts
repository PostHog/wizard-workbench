import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '@app/@core/services/data.service';

@Component({
  selector: 'app-activity-feed',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="activity-feed">
      <div class="feed-header">
        <h3>Recent Activity</h3>
        <span class="activity-count">{{ dataService.activities().length }} activities</span>
      </div>
      <div class="feed-list">
        @if (dataService.activities().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">📋</span>
            <p>No activity yet. Create a project or add a member to get started!</p>
          </div>
        } @else {
          @for (activity of dataService.activities(); track activity.id) {
            <div class="activity-item">
              <div class="activity-avatar">{{ activity.avatar }}</div>
              <div class="activity-content">
                <p>
                  <strong>{{ activity.user }}</strong>
                  {{ activity.action }}
                  <span class="target">{{ activity.target }}</span>
                </p>
                <span class="activity-time">{{ getTimeAgo(activity.time) }}</span>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      .activity-feed {
        background: var(--white);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .feed-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .activity-count {
          font-size: 0.75rem;
          color: var(--text-color-medium, #6b7280);
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
      }

      .feed-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 300px;
        overflow-y: auto;
      }

      .empty-state {
        text-align: center;
        padding: 2rem 1rem;
        color: var(--text-color-medium, #6b7280);

        .empty-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        p {
          margin: 0;
          font-size: 0.875rem;
        }
      }

      .activity-item {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
      }

      .activity-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
      }

      .activity-content {
        flex: 1;

        p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-color-dark, #1f2937);
          line-height: 1.4;

          .target {
            color: #f97316;
            font-weight: 500;
          }
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--text-color-medium, #6b7280);
        }
      }
    `,
  ],
})
export class ActivityFeedComponent {
  readonly dataService = inject(DataService);

  getTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }
}
