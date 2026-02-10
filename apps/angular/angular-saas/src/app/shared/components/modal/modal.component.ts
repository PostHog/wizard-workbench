import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onOverlayClick($event)" role="dialog" [attr.aria-modal]="true" [attr.aria-labelledby]="titleId()">
        <div class="modal-content" [style.max-width]="maxWidth()">
          <div class="modal-header">
            <h3 [id]="titleId()">{{ title() }}</h3>
            <button type="button" class="close-btn" (click)="close.emit()" aria-label="Close modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
      }

      .modal-content {
        background: var(--white, white);
        border-radius: 12px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e5e7eb;

        h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          font-size: 1.5rem;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;

          &:hover {
            background: #f3f4f6;
          }

          &:focus {
            outline: 2px solid #f97316;
            outline-offset: 2px;
          }
        }
      }

      .modal-body {
        padding: 1.5rem;
      }
    `,
  ],
})
export class ModalComponent {
  private static instanceCounter = 0;
  private readonly instanceId = ++ModalComponent.instanceCounter;

  isOpen = input(false);
  title = input('');
  maxWidth = input('480px');
  close = output<void>();

  readonly titleId = computed(() => `modal-title-${this.instanceId}`);

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
