import { Injectable, inject } from '@angular/core';

import { PostHogService } from './posthog.service';

type LogAttributes = Parameters<PostHogService['posthog']['logger']['info']>[1];

@Injectable({ providedIn: 'root' })
export class PostHogLoggerService {
  private readonly posthogService = inject(PostHogService);

  info(message: string, attributes: LogAttributes): void {
    if (this.posthogService.isInitialized) {
      this.posthogService.posthog.logger.info(message, attributes);
    }
  }

  warn(message: string, attributes: LogAttributes): void {
    if (this.posthogService.isInitialized) {
      this.posthogService.posthog.logger.warn(message, attributes);
    }
  }
}
