import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler extends ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  override handleError(error: unknown): void {
    const extractedError = this.extractError(error);

    if (extractedError) {
      this.posthogService.posthog.captureException(extractedError);
    }

    super.handleError(error);
  }

  private extractError(errorCandidate: unknown): Error | string | null {
    const error = this.unwrapZoneError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      return error.error instanceof Error ? error.error : error.message;
    }

    return typeof error === 'string' || error instanceof Error ? error : null;
  }

  private unwrapZoneError(error: unknown): unknown {
    if (
      error &&
      typeof error === 'object' &&
      'ngOriginalError' in error &&
      (error as { ngOriginalError?: unknown }).ngOriginalError
    ) {
      return (error as { ngOriginalError: unknown }).ngOriginalError;
    }

    return error;
  }
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useClass: PostHogErrorHandler,
  };
}
