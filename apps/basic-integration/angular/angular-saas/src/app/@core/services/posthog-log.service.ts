import { inject, Injectable } from '@angular/core';
import { PostHogService } from './posthog.service';

@Injectable({
  providedIn: 'root',
})
export class PostHogLogService {
  private readonly posthogService = inject(PostHogService);

  info(message: string, attributes: Record<string, string | number | boolean> = {}): void {
    this.posthogService.posthog.logger.info(message, attributes);
  }
}
