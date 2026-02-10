import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Logger } from '@app/@core/services';
import { CredentialsService } from '@app/auth';

const log = new Logger('AuthenticationGuard');

/* The `AlreadyLoggedCheckGuard` class is a guard in TypeScript that checks if a user is already
authenticated and redirects them to the dashboard if they are. */
@Injectable({
  providedIn: 'root',
})
export class AlreadyLoggedCheckGuard {
  private readonly credentialsService = inject(CredentialsService);
  private readonly router = inject(Router);

  async canActivate(): Promise<boolean> {
    const isAuthenticated = this.credentialsService.isAuthenticated();
    if (isAuthenticated) {
      this.router.navigateByUrl('/dashboard');
      return false;
    } else {
      return true;
    }
  }
}

/* The AuthenticationGuard class in TypeScript is used to check if a user is authenticated and redirect
to the login page if not. */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard {
  private readonly router = inject(Router);
  private readonly credentialsService = inject(CredentialsService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.credentialsService.isAuthenticated()) {
      return true;
    }

    log.debug('Not authenticated, redirecting and adding redirect url...');
    this.router.navigate(['/login'], { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }
}
