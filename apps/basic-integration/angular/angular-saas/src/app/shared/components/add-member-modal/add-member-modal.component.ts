import { Component, input, output, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { DataService } from '@app/@core/services/data.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { PosthogService } from '@core/services/posthog.service';

interface MemberForm {
  name: string;
  email: string;
  role: 'viewer' | 'member' | 'admin';
  avatar: string;
}

@Component({
  selector: 'app-add-member-modal',
  imports: [FormsModule, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal [isOpen]="isOpen()" title="Add Team Member" (close)="onClose()">
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input id="name" type="text" [value]="member().name" (input)="updateMember('name', $event)" name="name" placeholder="Enter full name" required />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" type="email" [value]="member().email" (input)="updateMember('email', $event)" name="email" placeholder="email@example.com" required />
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" [value]="member().role" (change)="updateMemberSelect('role', $event)" name="role">
            <option value="viewer">Viewer</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="form-group">
          <label>Avatar</label>
          <div class="avatar-picker">
            @for (emoji of avatarOptions; track emoji) {
              <button type="button" class="avatar-option" [class.selected]="member().avatar === emoji" (click)="selectAvatar(emoji)">
                {{ emoji }}
              </button>
            }
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-outline" (click)="onClose()">Cancel</button>
          <button type="submit" class="btn-primary" [disabled]="!member().name || !member().email">Add Member</button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [
    `
      .form-group {
        margin-bottom: 1rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        input,
        select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;

          &:focus {
            outline: none;
            border-color: #f97316;
          }
        }

        select {
          background: white;
          cursor: pointer;
        }
      }

      .avatar-picker {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .avatar-option {
        width: 44px;
        height: 44px;
        border: 2px solid #e5e7eb;
        border-radius: 50%;
        background: white;
        font-size: 1.25rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #d1d5db;
        }

        &.selected {
          border-color: #f97316;
          background: rgba(249, 115, 22, 0.1);
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }

      .btn-primary {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;

        &:hover:not(:disabled) {
          opacity: 0.9;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .btn-outline {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;

        &:hover {
          background: #f9fafb;
        }
      }
    `,
  ],
})
export class AddMemberModalComponent {
  private readonly dataService = inject(DataService);
  private readonly toast = inject(HotToastService);
  private readonly posthogService = inject(PosthogService);

  isOpen = input(false);
  close = output<void>();
  created = output<void>();

  readonly avatarOptions = ['👤', '👩', '👨', '🧑', '👩‍💼', '👨‍💼', '👩‍💻', '👨‍💻'];

  readonly member = signal<MemberForm>({
    name: '',
    email: '',
    role: 'member',
    avatar: '👤',
  });

  updateMember(key: 'name' | 'email', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.member.update((current) => ({ ...current, [key]: value }));
  }

  updateMemberSelect(key: 'role', event: Event) {
    const value = (event.target as HTMLSelectElement).value as MemberForm['role'];
    this.member.update((current) => ({ ...current, [key]: value }));
  }

  selectAvatar(emoji: string) {
    this.member.update((current) => ({ ...current, avatar: emoji }));
  }

  onSubmit() {
    const current = this.member();
    if (!current.name || !current.email) return;

    this.dataService.addMember({
      name: current.name,
      email: current.email,
      role: current.role,
      avatar: current.avatar,
    });
    this.posthogService.posthog.capture('team_member_added', {
      member_role: current.role,
    });

    this.toast.success(`${current.name} added to the team!`);
    this.resetForm();
    this.created.emit();
    this.close.emit();
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  private resetForm() {
    this.member.set({
      name: '',
      email: '',
      role: 'member',
      avatar: '👤',
    });
  }
}
