import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-welcome-banner',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="welcome-banner">
      <div class="welcome-content">
        <h1>Welcome back, {{ userName() || 'there' }}!</h1>
        <p>Here's what's happening with your {{ organizationName() || 'workspace' }} today.</p>
      </div>
      <div class="welcome-illustration">
        <span>🚀</span>
      </div>
    </div>
  `,
  styles: [
    `
      .welcome-banner {
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        border-radius: 16px;
        padding: 2rem;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .welcome-content {
        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }
      }

      .welcome-illustration {
        font-size: 3rem;
      }
    `,
  ],
})
export class WelcomeBannerComponent {
  userName = input<string | undefined>(undefined);
  organizationName = input<string | undefined>(undefined);
}
