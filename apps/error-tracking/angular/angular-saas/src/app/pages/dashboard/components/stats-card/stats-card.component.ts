import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stats-card">
      <div class="stats-icon" [style.background]="iconBg()">
        <span>{{ icon() }}</span>
      </div>
      <div class="stats-content">
        <span class="stats-label">{{ label() }}</span>
        <h3 class="stats-value">{{ value() }}</h3>
        @if (changePercent() !== undefined) {
          <span class="stats-change" [class.positive]="changePercent()! >= 0" [class.negative]="changePercent()! < 0"> {{ changePercent()! >= 0 ? '+' : '' }}{{ changePercent() }}% </span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .stats-card {
        background: var(--white);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: box-shadow 0.2s ease;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }

      .stats-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
      }

      .stats-content {
        flex: 1;
      }

      .stats-label {
        font-size: 0.875rem;
        color: var(--text-color-medium, #6b7280);
        display: block;
      }

      .stats-value {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0.25rem 0;
        color: var(--text-color-dark, #1f2937);
      }

      .stats-change {
        font-size: 0.75rem;
        font-weight: 600;

        &.positive {
          color: #10b981;
        }

        &.negative {
          color: #ef4444;
        }
      }
    `,
  ],
})
export class StatsCardComponent {
  label = input('');
  value = input<string | number>(0);
  icon = input('📊');
  iconBg = input('rgba(249, 115, 22, 0.1)');
  changePercent = input<number | undefined>(undefined);
}
