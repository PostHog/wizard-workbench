import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostHogService } from '@core/services';
import { HotToastService } from '@ngxpert/hot-toast';

interface NotificationSettings {
  productUpdates: boolean;
  weeklyDigest: boolean;
  teamActivity: boolean;
  desktop: boolean;
  sound: boolean;
}

@Component({
  selector: 'app-notification-settings',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="notification-settings">
      <h3>Notifications</h3>
      <p class="description">Manage how you receive notifications.</p>

      <div class="section">
        <h4>Email Notifications</h4>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <h5>Product Updates</h5>
              <p>News about product and feature updates</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [checked]="notifications().productUpdates" (change)="updateSetting('productUpdates', $event)" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h5>Weekly Digest</h5>
              <p>Weekly summary of your activity</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [checked]="notifications().weeklyDigest" (change)="updateSetting('weeklyDigest', $event)" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h5>Team Activity</h5>
              <p>Notifications when team members take actions</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [checked]="notifications().teamActivity" (change)="updateSetting('teamActivity', $event)" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="section">
        <h4>In-App Notifications</h4>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <h5>Desktop Notifications</h5>
              <p>Show notifications on your desktop</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [checked]="notifications().desktop" (change)="updateSetting('desktop', $event)" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h5>Sound</h5>
              <p>Play a sound for new notifications</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [checked]="notifications().sound" (change)="updateSetting('sound', $event)" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-primary" (click)="saveNotifications()">Save Preferences</button>
      </div>
    </div>
  `,
  styles: [
    `
      .notification-settings {
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

      .settings-list {
        display: flex;
        flex-direction: column;
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e7eb;

        .setting-info {
          h5 {
            margin: 0 0 0.25rem 0;
            font-size: 0.875rem;
            font-weight: 500;
          }

          p {
            margin: 0;
            font-size: 0.75rem;
            color: var(--text-color-medium, #6b7280);
          }
        }
      }

      .toggle {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 24px;

        input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #e5e7eb;
          transition: 0.3s;
          border-radius: 24px;

          &:before {
            position: absolute;
            content: '';
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
          }
        }

        input:checked + .slider {
          background-color: #f97316;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      }

      .form-actions {
        padding-top: 1rem;
      }

      .btn-primary {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          opacity: 0.9;
        }
      }
    `,
  ],
})
export class NotificationSettingsComponent {
  private readonly toast = inject(HotToastService);
  private readonly posthogService = inject(PostHogService);

  readonly notifications = signal<NotificationSettings>({
    productUpdates: true,
    weeklyDigest: true,
    teamActivity: false,
    desktop: true,
    sound: false,
  });

  updateSetting(key: keyof NotificationSettings, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.notifications.update((current) => ({ ...current, [key]: checked }));
  }

  saveNotifications() {
    const prefs = this.notifications();
    this.posthogService.posthog.capture('notification_preferences_saved', {
      email_product_updates: prefs.productUpdates,
      email_weekly_digest: prefs.weeklyDigest,
      email_team_activity: prefs.teamActivity,
      desktop_notifications: prefs.desktop,
      sound_notifications: prefs.sound,
    });
    this.toast.success('Notification preferences saved');
  }
}
