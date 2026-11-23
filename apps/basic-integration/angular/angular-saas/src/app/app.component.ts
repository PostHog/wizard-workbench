import { Component, OnInit, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { I18nService } from '@app/i18n';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { filter, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppUpdateService, Logger, PostHogService } from '@core/services';
import { SocketIoService } from '@core/socket-io';
import { AuthenticationService } from '@app/auth/services/authentication.service';

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
  private readonly posthogService = inject(PostHogService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);

  title = 'angular-boilerplate';

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    if (!environment.posthogProjectToken) {
      if (!environment.production) {
        throw new Error(
          'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
        );
      }
    } else if (!environment.posthogHost) {
      if (!environment.production) {
        throw new Error(
          'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured',
        );
      }
    } else {
      this.posthogService.init(environment.posthogProjectToken, {
        api_host: environment.posthogHost,
        logs: {
          serviceName: 'angular-boilerplate-web',
          environment: environment.production ? 'production' : 'development',
          serviceVersion: environment.version,
        },
      });
      this.authenticationService.identifyCurrentUser();
      this.posthogService.posthog.logger.info('PostHog log capture initialized', {
        event: 'posthog_log_capture_initialized',
        app_version: environment.version,
      });
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
