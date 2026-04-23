import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

interface SettingsTab {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-settings',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="main-container settings-page">
      <h2>Settings</h2>

      <div class="settings-layout">
        <nav class="settings-nav">
          @for (tab of tabs; track tab.path) {
            <a [routerLink]="tab.path" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">{{ tab.icon }}</span>
              <span class="nav-label">{{ tab.label }}</span>
            </a>
          }
        </nav>

        <div class="settings-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .settings-page {
        h2 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
      }

      .settings-layout {
        display: grid;
        grid-template-columns: 240px 1fr;
        gap: 2rem;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .settings-nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        @media (max-width: 768px) {
          flex-direction: row;
          overflow-x: auto;
          padding-bottom: 1rem;
        }
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        color: var(--text-color-dark, #1f2937);
        text-decoration: none;
        transition: all 0.2s;

        &:hover {
          background: #f3f4f6;
        }

        &.active {
          background: rgba(249, 115, 22, 0.1);
          color: #ea580c;
          font-weight: 500;
        }

        .nav-icon {
          font-size: 1.25rem;
        }

        .nav-label {
          font-size: 0.875rem;
          white-space: nowrap;
        }
      }

      .settings-content {
        background: var(--white);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        min-height: 400px;
      }
    `,
  ],
})
export class SettingsComponent {
  tabs: SettingsTab[] = [
    { label: 'Account', path: 'account', icon: '👤' },
    { label: 'Preferences', path: 'preferences', icon: '⚙️' },
    { label: 'Notifications', path: 'notifications', icon: '🔔' },
    { label: 'Security', path: 'security', icon: '🔒' },
  ];
}
