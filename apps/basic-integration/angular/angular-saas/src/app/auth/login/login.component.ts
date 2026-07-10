import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { PostHogService } from '@shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthenticationService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly posthogService = inject(PostHogService);

  version: string | null = environment.version;

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.authService
      .login({ username, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res) {
            this.posthogService.posthog.identify(res.id, {
              email: res.email,
              username: res.username,
              first_name: res.firstName,
              last_name: res.lastName,
              roles: res.roles,
            });
            this.posthogService.posthog.capture('user_logged_in', {
              is_mobile_login: false,
              redirect_target: this.route.snapshot.queryParams['redirect'] || '/dashboard',
              roles_count: res.roles?.length ?? 0,
            });
            console.log('Login successful');
            this.router.navigate([this.route.snapshot.queryParams['redirect'] || '/dashboard'], { replaceUrl: true }).then(() => {
              console.log('Navigated to dashboard');
            });
          }
        },
        error: (error) => {
          this.posthogService.posthog.captureException(error);
          this.posthogService.posthog.capture('user_login_failed', {
            is_mobile_login: false,
            has_redirect_target: Boolean(this.route.snapshot.queryParams['redirect']),
          });
        },
      });
  }
}
