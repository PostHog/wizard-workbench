import { inject, Injectable } from '@angular/core';

import { PostHogService } from './posthog.service';

type LogAttributes = Record<string, boolean | number | string>;

@Injectable({ providedIn: 'root' })
export class PostHogLoggerService {
  private readonly posthogService = inject(PostHogService);

  info(message: string, attributes: LogAttributes): void {
    if (!this.posthogService.isInitialized) {
      return;
    }

    this.posthogService.posthog.logger.info(message, attributes);
  }
}
