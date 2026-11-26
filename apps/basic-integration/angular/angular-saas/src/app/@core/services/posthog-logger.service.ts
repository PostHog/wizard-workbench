import { Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

type LogAttributes = Record<string, string | number | boolean>;

/**
 * Sends only purpose-written application logs to PostHog.
 * Existing console and application logger output remains local.
 */
@Injectable({ providedIn: 'root' })
export class PostHogLoggerService {
  private readonly posthogService = inject(PostHogService);

  info(message: string, attributes: LogAttributes = {}): void {
    const posthog = this.posthogService.posthog;
    posthog.logger?.info(message, attributes);
  }
}
