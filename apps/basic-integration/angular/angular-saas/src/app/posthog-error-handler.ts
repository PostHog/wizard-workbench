import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services/posthog.service';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler extends ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  override handleError(error: unknown): void {
    this.posthogService.posthog?.captureException(this.extractError(error));
    super.handleError(error);
  }

  private extractError(error: unknown): Error {
    const originalError = (error as { ngOriginalError?: unknown })?.ngOriginalError ?? error;

    if (originalError instanceof Error) {
      return originalError;
    }

    return new Error(typeof originalError === 'string' ? originalError : 'Unknown error');
  }
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useClass: PostHogErrorHandler,
  };
}
