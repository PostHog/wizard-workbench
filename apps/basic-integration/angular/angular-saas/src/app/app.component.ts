import { Component, OnInit, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { I18nService } from '@app/i18n';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { CredentialsService } from '@app/auth/services/credentials.service';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { filter, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppUpdateService, Logger, PostHogLogsService, PostHogService } from '@core/services';
import { SocketIoService } from '@core/socket-io';

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
  private readonly credentialsService = inject(CredentialsService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly posthogService = inject(PostHogService);
  private readonly posthogLogsService = inject(PostHogLogsService);
  private readonly destroyRef = inject(DestroyRef);

  title = 'angular-boilerplate';

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    // Initialize i18nService with default language and supported languages
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    this.initializePostHog();
    const credentials = this.credentialsService.credentials();
    if (credentials) {
      this.authenticationService.identify(credentials);
    }

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

  private initializePostHog(): void {
    if (!environment.posthogKey) {
      if (!environment.production) {
        throw new Error(
          'NG_APP_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_PROJECT_TOKEN is configured',
        );
      }
      return;
    }

    if (!environment.posthogHost) {
      if (!environment.production) {
        throw new Error(
          'NG_APP_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NG_APP_POSTHOG_HOST is configured',
        );
      }
      return;
    }

    this.posthogService.init(environment.posthogKey, {
      api_host: environment.posthogHost,
      capture_exceptions: true,
      capture_pageview: 'history_change',
      logs: {
        serviceName: 'angular-boilerplate-web',
        environment: environment.production ? 'production' : 'development',
      },
    });
    this.posthogLogsService.info('application_initialized', {
      initialization_source: 'app_component',
    });
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
