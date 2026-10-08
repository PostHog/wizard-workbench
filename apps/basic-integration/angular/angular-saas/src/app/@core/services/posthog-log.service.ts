import { Injectable, inject } from '@angular/core';

import { PosthogService } from './posthog.service';

@Injectable({ providedIn: 'root' })
export class PosthogLogService {
  private readonly posthogService = inject(PosthogService);

  info(message: string, attributes?: Record<string, string | number | boolean>): void {
    this.posthogService.client?.logger.info(message, attributes);
  }
}
