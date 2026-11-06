import { Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

type LogAttributes = Record<string, string | number | boolean>;

/**
 * Sends only the application's explicitly selected, structured lifecycle logs
 * to PostHog. It intentionally does not forward the existing console logger.
 */
@Injectable({ providedIn: 'root' })
export class PostHogLoggerService {
  private readonly posthogService = inject(PostHogService);

  applicationInitialized(): void {
    this.info('application initialized', { event: 'application_initialized' });
  }

  userAuthenticated(): void {
    this.info('user authenticated', { event: 'user_authenticated' });
  }

  userLoggedOut(): void {
    this.info('user logged out', { event: 'user_logged_out' });
  }

  private info(message: string, attributes: LogAttributes): void {
    this.posthogService.posthog.logger?.info?.(message, attributes);
  }
}
