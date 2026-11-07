import { Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

/** Sends only purpose-written application logs to PostHog. */
@Injectable({
  providedIn: 'root',
})
export class PostHogLoggerService {
  private readonly posthogService = inject(PostHogService);

  appReady(): void {
    this.posthogService.posthog.logger.info('application ready', {
      event: 'application.ready',
    });
  }

  loginCompleted(rememberSession: boolean, isMobile: boolean): void {
    this.posthogService.posthog.logger.info('authentication completed', {
      event: 'authentication.login_completed',
      remember_session: rememberSession,
      is_mobile: isMobile,
    });
  }

  logoutCompleted(): void {
    this.posthogService.posthog.logger.info('authentication completed', {
      event: 'authentication.logout_completed',
    });
  }
}
