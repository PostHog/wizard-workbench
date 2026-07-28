import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@app/shell/services/theme.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { PosthogService } from '@app/@core/services/posthog.service';

interface Preferences {
  isDarkMode: boolean;
  isCompactView: boolean;
  dateFormat: string;
  timezone: string;
  landingPage: string;
}

@Component({
  selector: 'app-preferences-settings',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preferences-settings">
      <h3>Preferences</h3>
      <p class="description">Customize your experience and display settings.</p>

      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <h4>Dark Mode</h4>
            <p>Switch between light and dark themes</p>
          </div>
          <label class="toggle">
            <input type="checkbox" [checked]="preferences().isDarkMode" (change)="toggleTheme($event)" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>Compact View</h4>
            <p>Use a more condensed layout</p>
          </div>
          <label class="toggle">
            <input type="checkbox" [checked]="preferences().isCompactView" (change)="updatePreference('isCompactView', $event)" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>Date Format</h4>
            <p>Choose your preferred date format</p>
          </div>
          <select [value]="preferences().dateFormat" (change)="updateSelectPreference('dateFormat', $event)" class="select-input">
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>Timezone</h4>
            <p>Set your local timezone</p>
          </div>
          <select [value]="preferences().timezone" (change)="updateSelectPreference('timezone', $event)" class="select-input">
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>Default Landing Page</h4>
            <p>Choose which page to show after login</p>
          </div>
          <select [value]="preferences().landingPage" (change)="updateSelectPreference('landingPage', $event)" class="select-input">
            <option value="dashboard">Dashboard</option>
            <option value="users">Team</option>
            <option value="profile">Profile</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-primary" (click)="savePreferences()">Save Preferences</button>
      </div>
    </div>
  `,
  styles: [
    `
      .preferences-settings {
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

      .settings-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e5e7eb;

        .setting-info {
          h4 {
            margin: 0 0 0.25rem 0;
            font-size: 0.875rem;
            font-weight: 600;
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

      .select-input {
        padding: 0.5rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        font-size: 0.875rem;
        background: white;
        min-width: 180px;

        &:focus {
          outline: none;
          border-color: #f97316;
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
export class PreferencesSettingsComponent {
  private readonly themeService = inject(ThemeService);
  private readonly toast = inject(HotToastService);
  private readonly posthogService = inject(PosthogService);

  readonly preferences = signal<Preferences>({
    isDarkMode: false,
    isCompactView: false,
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/New_York',
    landingPage: 'dashboard',
  });

  updatePreference(key: 'isDarkMode' | 'isCompactView', event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.preferences.update((current) => ({ ...current, [key]: checked }));
  }

  updateSelectPreference(key: 'dateFormat' | 'timezone' | 'landingPage', event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.preferences.update((current) => ({ ...current, [key]: value }));
  }

  toggleTheme(event: Event) {
    const isDarkMode = (event.target as HTMLInputElement).checked;
    this.preferences.update((current) => ({ ...current, isDarkMode }));
    if (isDarkMode) {
      this.themeService.setDarkTheme();
    } else {
      this.themeService.setLightTheme();
    }
  }

  savePreferences() {
    this.posthogService.client.capture('preferences_saved');
    this.toast.success('Preferences saved');
  }
}
