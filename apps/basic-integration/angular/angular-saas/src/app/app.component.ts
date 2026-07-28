import { Component, OnInit, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { I18nService } from '@app/i18n';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { filter, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppUpdateService, Logger } from '@core/services';
import { SocketIoService } from '@core/socket-io';
import { PosthogService } from '@core/services/posthog.service';
import { AuthenticationService, CredentialsService } from '@app/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly translateService = inject(TranslateService);
  private readonly i18nService = inject(I18nService);
  private readonly socketService = inject(SocketIoService);
  private readonly updateService = inject(AppUpdateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly posthogService = inject(PosthogService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly credentialsService = inject(CredentialsService);

  title = 'angular-boilerplate';

  ngOnInit() {
    this.posthogService.init();

    const credentials = this.credentialsService.credentials();
    if (credentials) {
      this.authenticationService.identify(credentials);
    }

    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    // Initialize i18nService with default language and supported languages
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        const titles = this.getTitle(this.router.routerState, this.router.routerState.root);

        if (titles.length === 0) {
          this.titleService.setTitle(this.translateService.instant('Home'));
        } else {
          const translatedTitles = titles.map((titlePart) => this.translateService.instant(titlePart));
          const allTitlesSame = translatedTitles.every((title, _, arr) => title === arr[0]);
          this.titleService.setTitle(allTitlesSame ? translatedTitles[0] : translatedTitles.join(' | '));
        }

        if (event['lang']) {
          // Uncomment the following line to force a reload of the page when the language changes if needed for translations from backend
          // window.location.reload();
        }
      });

    // Connect to Socket
    this.socketService.connect();

    // update service
    this.updateService.subscribeForUpdates();
  }

  getTitle(state: any, parent: any): any[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
}
