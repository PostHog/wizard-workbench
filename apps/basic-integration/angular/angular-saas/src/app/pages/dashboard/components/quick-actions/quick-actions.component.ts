import { Component, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { PostHogService } from '@app/services/posthog.service';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-quick-actions',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        @for (action of actions; track action.id) {
          <button class="action-btn" [style.--action-color]="action.color" (click)="onAction(action.id)">
            <span class="action-icon">{{ action.icon }}</span>
            <span class="action-label">{{ action.label }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .quick-actions {
        background: var(--white);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
        }
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--action-color, #f97316);
          background: rgba(249, 115, 22, 0.05);
        }

        .action-icon {
          font-size: 1.25rem;
        }

        .action-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-color-dark, #1f2937);
        }
      }
    `,
  ],
})
export class QuickActionsComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);
  private readonly posthogService = inject(PostHogService);

  newProject = output<void>();
  addMember = output<void>();

  actions: QuickAction[] = [
    { id: 'new-project', label: 'New Project', icon: '➕', color: '#10b981' },
    { id: 'add-member', label: 'Add Member', icon: '👤', color: '#3b82f6' },
    { id: 'upload-file', label: 'Upload File', icon: '📁', color: '#8b5cf6' },
    { id: 'view-reports', label: 'View Reports', icon: '📊', color: '#f97316' },
  ];

  onAction(actionId: string) {
    const action = this.actions.find((a) => a.id === actionId);
    this.posthogService.posthog.capture('quick_action_clicked', {
      action_id: actionId,
      action_label: action?.label,
    });
    switch (actionId) {
      case 'new-project':
        this.newProject.emit();
        break;
      case 'add-member':
        this.addMember.emit();
        break;
      case 'upload-file':
        this.toast.info('File upload coming soon!');
        break;
      case 'view-reports':
        this.toast.info('Reports coming soon!');
        break;
    }
  }
}
