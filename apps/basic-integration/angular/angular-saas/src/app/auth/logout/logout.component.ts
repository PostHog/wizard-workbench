import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { PosthogService } from '@core/services';

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
  private readonly posthogService = inject(PosthogService);

  ngOnInit() {
    if (!this.credentialsService.isAuthenticated()) {
      this.credentialsService.setCredentials();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    } else {
      this.authService.logout().subscribe({
        next: () => {
          this.posthogService.client.reset();
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
