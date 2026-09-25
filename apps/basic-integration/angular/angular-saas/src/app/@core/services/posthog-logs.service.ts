import { Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

@Injectable({ providedIn: 'root' })
export class PostHogLogsService {
  private readonly posthogService = inject(PostHogService);

  info(message: string, attributes: Record<string, string | number | boolean>): void {
    this.posthogService.posthog.logger.info(message, attributes);
  }
}
