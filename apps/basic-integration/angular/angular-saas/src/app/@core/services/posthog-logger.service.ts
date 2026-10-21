import { Injectable, inject } from '@angular/core';

import { PostHogService } from './posthog.service';

type LogAttributes = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root',
})
export class PostHogLoggerService {
  private readonly posthogService = inject(PostHogService);

  info(message: string, attributes: LogAttributes): void {
    this.posthogService.client?.logger.info(message, attributes);
  }
}
