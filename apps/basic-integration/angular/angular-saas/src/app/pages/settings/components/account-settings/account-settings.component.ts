import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredentialsService } from '@app/auth/services/credentials.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { PostHogService } from '@core/services';

@Component({
  selector: 'app-account-settings',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="account-settings">
      <h3>Account Settings</h3>
      <p class="description">Manage your account information and password.</p>

      <form [formGroup]="accountForm" (ngSubmit)="onSave()">
        <div class="section">
          <h4>Profile Information</h4>
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input id="firstName" formControlName="firstName" />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input id="lastName" formControlName="lastName" />
            </div>
            <div class="form-group full-width">
              <label for="email">Email Address</label>
              <input id="email" type="email" formControlName="email" />
            </div>
          </div>
        </div>

        <div class="section">
          <h4>Change Password</h4>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="currentPassword">Current Password</label>
              <input id="currentPassword" type="password" formControlName="currentPassword" />
            </div>
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input id="newPassword" type="password" formControlName="newPassword" />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input id="confirmPassword" type="password" formControlName="confirmPassword" />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Save Changes</button>
        </div>
      </form>

      <div class="danger-zone">
        <h4>Danger Zone</h4>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button type="button" class="btn-danger">Delete Account</button>
      </div>
    </div>
  `,
  styles: [
    `
      .account-settings {
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
        padding-bottom: 2rem;
        border-bottom: 1px solid #e5e7eb;

        h4 {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-color-dark, #1f2937);
        }
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;

        .full-width {
          grid-column: span 2;
        }

        @media (max-width: 640px) {
          grid-template-columns: 1fr;

          .full-width {
            grid-column: span 1;
          }
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-color-dark, #1f2937);
        }

        input {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;

          &:focus {
            outline: none;
            border-color: #f97316;
          }
        }
      }

      .form-actions {
        margin-bottom: 2rem;
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

      .danger-zone {
        padding: 1.5rem;
        border: 1px solid #fecaca;
        border-radius: 8px;
        background: #fef2f2;

        h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #dc2626;
        }

        p {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          color: var(--text-color-dark, #1f2937);
        }

        .btn-danger {
          padding: 0.5rem 1rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;

          &:hover {
            background: #b91c1c;
          }
        }
      }
    `,
  ],
})
export class AccountSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly credentialsService = inject(CredentialsService);
  private readonly toast = inject(HotToastService);
  private readonly posthogService = inject(PostHogService);

  accountForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', Validators.email],
    currentPassword: [''],
    newPassword: [''],
    confirmPassword: [''],
  });

  ngOnInit() {
    const user = this.credentialsService.credentials();
    if (user) {
      this.accountForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }

  onSave() {
    this.toast.success('Account settings saved');
    this.posthogService.client?.capture('account_settings_saved');
  }
}
