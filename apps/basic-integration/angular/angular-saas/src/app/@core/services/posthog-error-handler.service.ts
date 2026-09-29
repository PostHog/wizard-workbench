import { ErrorHandler, Injectable, inject } from '@angular/core';

import { PostHogService } from './posthog.service';

@Injectable({ providedIn: 'root' })
export class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    this.posthogService.posthog.captureException(this.extractException(error));
  }

  private extractException(error: unknown): Error {
    const originalError =
      error && typeof error === 'object' && 'ngOriginalError' in error
        ? (error as { ngOriginalError: unknown }).ngOriginalError
        : error;

    if (originalError instanceof Error) {
      return originalError;
    }

    return new Error(typeof originalError === 'string' ? originalError : 'Unknown Angular error');
  }
}
