import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { CredentialsService } from '@app/auth/services/credentials.service';
import { PostHogService } from '@app/shared/services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly credentialsService = inject(CredentialsService);
  private readonly posthogService = inject(PostHogService);

  ngOnInit() {
    if (!this.credentialsService.isAuthenticated()) {
      this.credentialsService.setCredentials();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    } else {
      this.authService.logout().subscribe({
        next: () => {
          this.posthogService.posthog.capture('user_signed_out');
          this.posthogService.posthog.reset();
          this.credentialsService.setCredentials();
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        },
        error: () => {
          console.error('Error logging out');
        },
      });
    }
  }
}
