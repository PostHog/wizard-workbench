import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialsService } from '@app/auth/services/credentials.service';
import { PosthogService } from '@core/services';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(HotToastService);
  private readonly posthogService = inject(PosthogService);
  readonly credentialsService = inject(CredentialsService);

  readonly isEditing = signal(false);

  readonly userInitials = computed(() => {
    const user = this.credentialsService.credentials();
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  });

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
  });

  ngOnInit() {
    const user = this.credentialsService.credentials();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
      });
    }
  }

  toggleEdit() {
    this.isEditing.update((v) => !v);
    if (!this.isEditing()) {
      const user = this.credentialsService.credentials();
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          username: user.username || '',
        });
      }
    }
  }

  onSave() {
    if (this.profileForm.valid) {
      this.posthogService.client?.capture('profile_updated');
      this.toast.success('Profile updated successfully');
      this.isEditing.set(false);
    } else {
      this.toast.error('Please fill in all required fields');
    }
  }
}
