import { ErrorHandler, Injectable, inject } from '@angular/core';

import { PosthogService } from './posthog.service';

@Injectable({
  providedIn: 'root',
})
export class PosthogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PosthogService);

  handleError(error: unknown): void {
    const exception = error instanceof Error ? error : new Error(String(error));

    this.posthogService.client?.captureException(exception);
    console.error(error);
  }
}
