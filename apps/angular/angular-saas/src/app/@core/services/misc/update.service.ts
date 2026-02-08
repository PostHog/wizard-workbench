import { ApplicationRef, Component, DestroyRef, Inject, inject, Injectable, Optional } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { concat, from, interval, of } from 'rxjs';
import { catchError, first, startWith, switchMap } from 'rxjs/operators';
import { HotToastRef, HotToastService } from '@ngxpert/hot-toast';

/* The `AppUpdateService` is responsible for checking for app updates using a
service worker and displaying update alerts to the user. */
@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly toastService = inject(HotToastService);
  private readonly appRef = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);

  private _isUpdateToastShown = false;

  constructor() {
    console.log('%c Update service is running...', 'color: green; font-weight: bold;');

    if (this.swUpdate?.isEnabled) {
      console.log('%c Service worker enabled', 'color: orange; font-weight: bold;');

      // Allow the app to stabilize first, before starting polling for updates.
      const appIsStable$ = this.appRef?.isStable?.pipe(first((isStable) => isStable === true));
      const everySixHours$ = interval(1000 * 60 * 60 * 6).pipe(startWith(0));
      const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

      everySixHoursOnceAppIsStable$
        .pipe(
          switchMap(() => {
            console.log('%c Checking for app updates...', 'color: yellow; font-weight: bold;');
            this._isUpdateToastShown = false;
            return from(this.swUpdate.checkForUpdate()).pipe(
              catchError((err) => {
                console.error('Failed to check for updates:', err);
                return of(false);
              }),
            );
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((updateFound) => {
          console.log('%c Finish checking for updates...', 'color: yellow; font-weight: bold;');
          console.log(updateFound ? '%c A new version is available.' : '%c Already on the latest version.', 'color: white; font-weight: bold;');
        });
    } else {
      console.log('%c No service worker allow', 'color: red; font-weight: bold;');
    }
  }

  subscribeForUpdates(): void {
    this.swUpdate?.versionUpdates?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((evt) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`%c Downloading new app version: ${evt.version.hash}`, 'color: green;');
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`%c New app version ready for use: ${evt.latestVersion.hash}`, 'color: cyan; font-weight: bold;');
          this._showAppUpdateAlert();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`%c Failed to install app version '${evt.version.hash}': ${evt.error}`, 'color: red; font-weight: bold;');
          break;
      }
    });
  }

  private _showAppUpdateAlert() {
    if (this._isUpdateToastShown) {
      return;
    }
    this._isUpdateToastShown = true;
    const toastRef = this.toastService.show(UpdateComponent, {
      autoClose: false,
      dismissible: false,
    });
    toastRef.afterClosed.subscribe(() => {
      this.swUpdate.activateUpdate().then(() => document.location.reload());
      this._isUpdateToastShown = false;
    });
  }
}

// App Update Notification Component
@Component({
  selector: 'app-update-component',
  template: `
    New Version is Available.
    <a style="color: #E9380BFF" (click)="toastRef.close({ dismissedByAction: true })">Please Click to Update</a>
    or <a style="color: #E9380BFF" (click)="toastRef.close({ dismissedByAction: false })">Close</a>
  `,
})
export class UpdateComponent {
  constructor(@Optional() @Inject(HotToastRef) public toastRef: HotToastRef<string>) {}
}
