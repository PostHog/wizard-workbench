import { ErrorHandler, Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

@Injectable({
  providedIn: 'root',
})
export class PostHogErrorHandler extends ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  override handleError(error: unknown): void {
    this.posthogService.posthog.captureException(error);
    super.handleError(error);
  }
}
