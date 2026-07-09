import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { CredentialsService } from '@app/auth/services/credentials.service';

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

  ngOnInit() {
    if (!this.credentialsService.isAuthenticated()) {
      this.credentialsService.setCredentials();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    } else {
      this.authService.logout().subscribe({
        next: () => {
          this.credentialsService.setCredentials();
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('Error logging out', error);
        },
      });
    }
  }
}
