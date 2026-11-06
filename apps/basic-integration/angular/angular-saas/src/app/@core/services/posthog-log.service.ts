import { Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

type LogAttributes = Record<string, string | number | boolean>;

/** Sends only purpose-written application logs to PostHog. */
@Injectable({ providedIn: 'root' })
export class PostHogLogService {
  private readonly posthogService = inject(PostHogService);

  info(message: string, attributes?: LogAttributes): void {
    this.posthogService.posthog.logger?.info?.(message, attributes);
  }
}
