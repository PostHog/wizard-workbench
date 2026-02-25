import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { PosthogService } from '@app/services/posthog.service';

interface Session {
  id: number;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface LoginEntry {
  id: number;
  success: boolean;
  location: string;
  time: string;
}

@Component({
  selector: 'app-security-settings',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="security-settings">
      <h3>Security</h3>
      <p class="description">Manage your account security and active sessions.</p>

      <div class="section">
        <h4>Two-Factor Authentication</h4>
        <div class="tfa-card">
          <div class="tfa-info">
            <div class="tfa-status" [class.enabled]="tfaEnabled()">
              <span class="status-icon">{{ tfaEnabled() ? '✓' : '✕' }}</span>
              <span>{{ tfaEnabled() ? 'Enabled' : 'Disabled' }}</span>
            </div>
            <p>Add an extra layer of security to your account by requiring a verification code in addition to your password.</p>
          </div>
          <button type="button" [class.btn-primary]="!tfaEnabled()" [class.btn-outline]="tfaEnabled()" (click)="toggleTfa()">
            {{ tfaEnabled() ? 'Disable 2FA' : 'Enable 2FA' }}
          </button>
        </div>
      </div>

      <div class="section">
        <h4>Active Sessions</h4>
        <div class="sessions-list">
          @for (session of sessions(); track session.id) {
            <div class="session-item">
              <div class="session-icon">💻</div>
              <div class="session-info">
                <h5>{{ session.device }}</h5>
                <p>{{ session.location }} · {{ session.lastActive }}</p>
              </div>
              @if (session.current) {
                <span class="current-badge">Current</span>
              } @else {
                <button type="button" class="btn-text" (click)="revokeSession(session)">Revoke</button>
              }
            </div>
          }
        </div>
        <button type="button" class="btn-text revoke-all" (click)="revokeAllSessions()">Revoke all other sessions</button>
      </div>

      <div class="section">
        <h4>Login History</h4>
        <div class="history-list">
          @for (entry of loginHistory(); track entry.id) {
            <div class="history-item">
              <div class="history-status" [class.success]="entry.success" [class.failed]="!entry.success">
                {{ entry.success ? '✓' : '✕' }}
              </div>
              <div class="history-info">
                <p class="history-action">{{ entry.success ? 'Successful login' : 'Failed login attempt' }}</p>
                <p class="history-meta">{{ entry.location }} · {{ entry.time }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .security-settings {
        h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .description {
          margin: 0 0 2rem 0;
          color: var(--text-color-medium, #6b7280);
          font-size: 0.875rem;
        }
      }

      .section {
        margin-bottom: 2rem;

        h4 {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-color-dark, #1f2937);
        }
      }

      .tfa-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 8px;

        .tfa-info {
          flex: 1;

          p {
            margin: 0.5rem 0 0 0;
            font-size: 0.875rem;
            color: var(--text-color-medium, #6b7280);
            max-width: 400px;
          }
        }

        .tfa-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          color: #dc2626;

          &.enabled {
            color: #10b981;
          }

          .status-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
          }
        }
      }

      .btn-primary {
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
      }

      .btn-outline {
        padding: 0.5rem 1rem;
        background: white;
        color: var(--text-color-dark, #1f2937);
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;

        &:hover {
          background: #f9fafb;
        }
      }

      .btn-text {
        background: none;
        border: none;
        color: #f97316;
        font-size: 0.875rem;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }

        &.revoke-all {
          margin-top: 1rem;
        }
      }

      .sessions-list {
        display: flex;
        flex-direction: column;
      }

      .session-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e7eb;

        .session-icon {
          font-size: 1.25rem;
        }

        .session-info {
          flex: 1;

          h5 {
            margin: 0;
            font-size: 0.875rem;
            font-weight: 500;
          }

          p {
            margin: 0.25rem 0 0 0;
            font-size: 0.75rem;
            color: var(--text-color-medium, #6b7280);
          }
        }

        .current-badge {
          padding: 0.25rem 0.5rem;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      }

      .history-list {
        display: flex;
        flex-direction: column;
      }

      .history-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e5e7eb;

        .history-status {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;

          &.success {
            background: #dcfce7;
            color: #16a34a;
          }

          &.failed {
            background: #fee2e2;
            color: #dc2626;
          }
        }

        .history-info {
          .history-action {
            margin: 0;
            font-size: 0.875rem;
          }

          .history-meta {
            margin: 0.25rem 0 0 0;
            font-size: 0.75rem;
            color: var(--text-color-medium, #6b7280);
          }
        }
      }
    `,
  ],
})
export class SecuritySettingsComponent {
  private readonly toast = inject(HotToastService);
  private readonly posthogService = inject(PosthogService);

  readonly tfaEnabled = signal(false);

  readonly sessions = signal<Session[]>([
    { id: 1, device: 'MacBook Pro - Chrome', location: 'San Francisco, CA', lastActive: 'Active now', current: true },
    { id: 2, device: 'iPhone 15 - Safari', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Windows PC - Firefox', location: 'New York, NY', lastActive: '3 days ago', current: false },
  ]);

  readonly loginHistory = signal<LoginEntry[]>([
    { id: 1, success: true, location: 'San Francisco, CA', time: 'Today at 10:23 AM' },
    { id: 2, success: true, location: 'San Francisco, CA', time: 'Yesterday at 3:45 PM' },
    { id: 3, success: false, location: 'Unknown', time: 'Jan 15 at 8:12 AM' },
    { id: 4, success: true, location: 'New York, NY', time: 'Jan 14 at 2:30 PM' },
  ]);

  toggleTfa() {
    this.tfaEnabled.update((v) => !v);
    this.posthogService.posthog.capture('tfa_toggled', { enabled: this.tfaEnabled() });
    this.toast.success(this.tfaEnabled() ? '2FA enabled' : '2FA disabled');
  }

  revokeSession(session: Session) {
    this.sessions.update((current) => current.filter((s) => s.id !== session.id));
    this.posthogService.posthog.capture('session_revoked', {
      revoke_type: 'single',
      device: session.device,
    });
    this.toast.success('Session revoked');
  }

  revokeAllSessions() {
    const revokedCount = this.sessions().filter((s) => !s.current).length;
    this.sessions.update((current) => current.filter((s) => s.current));
    this.posthogService.posthog.capture('session_revoked', {
      revoke_type: 'all',
      sessions_revoked: revokedCount,
    });
    this.toast.success('All other sessions revoked');
  }
}
