import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { PosthogService } from '@app/services/posthog.service';

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
  private readonly posthogService = inject(PosthogService);

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

    this.posthogService.posthog.capture('login_submitted', { username });

    this.authService
      .login({ username, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res) {
            this.posthogService.posthog.identify(res.id, {
              username: res.username,
              email: res.email,
              firstName: res.firstName,
              lastName: res.lastName,
            });
            this.posthogService.posthog.capture('login_succeeded', { username: res.username });
            console.log('Login successful');
            this.router.navigate([this.route.snapshot.queryParams['redirect'] || '/dashboard'], { replaceUrl: true }).then(() => {
              console.log('Navigated to dashboard');
            });
          }
        },
        error: (error) => {
          this.posthogService.posthog.capture('login_failed', {
            username,
            error_message: error?.message || 'Unknown error',
          });
          this.posthogService.posthog.capture('$exception', {
            $exception_message: error?.message || 'Login failed',
            $exception_type: error?.name || 'LoginError',
            $exception_stack_trace_raw: error?.stack,
          });
        },
      });
  }
}
