import { ErrorHandler, Injectable, inject } from '@angular/core';

import { PosthogService } from './posthog.service';

@Injectable()
export class PosthogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PosthogService);

  handleError(error: unknown): void {
    this.posthogService.client.captureException(error);
    console.error(error);
  }
}
