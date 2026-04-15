import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { PosthogService } from '@app/shared/services';

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

    this.authService
      .login({ username, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('Login successful');
            this.posthogService.posthog.identify(res.id, {
              username: res.username,
              email: res.email,
              firstName: res.firstName,
              lastName: res.lastName,
            });
            this.posthogService.posthog.capture('user_logged_in', {
              username: res.username,
              email: res.email,
            });
            this.router.navigate([this.route.snapshot.queryParams['redirect'] || '/dashboard'], { replaceUrl: true }).then(() => {
              console.log('Navigated to dashboard');
            });
          }
        },
        error: (error) => {
          // Handle the error here
        },
      });
  }
}
