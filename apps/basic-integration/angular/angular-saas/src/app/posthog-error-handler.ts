import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PosthogService } from '@core/services/posthog.service';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PosthogService);

  handleError(error: unknown): void {
    console.error(error);

    const extractedError = this.extractError(error);
    if (extractedError) {
      this.posthogService.client.captureException(extractedError);
    }
  }

  private extractError(errorCandidate: unknown): Error | string | null {
    const error = this.unwrapZoneError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      return error.error instanceof Error ? error.error : error.message;
    }

    return error instanceof Error || typeof error === 'string' ? error : null;
  }

  private unwrapZoneError(error: unknown): unknown {
    if (error && typeof error === 'object' && 'ngOriginalError' in error) {
      return (error as { ngOriginalError: unknown }).ngOriginalError;
    }

    return error;
  }
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useExisting: PostHogErrorHandler,
  };
}
