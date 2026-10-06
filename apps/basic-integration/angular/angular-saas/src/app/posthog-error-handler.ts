import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services';

@Injectable()
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);
  private readonly defaultErrorHandler = new ErrorHandler();

  handleError(error: unknown): void {
    this.posthogService.posthog.captureException(extractError(error));
    this.defaultErrorHandler.handleError(error);
  }
}

function extractError(errorCandidate: unknown): Error | string {
  const error = unwrapZoneError(errorCandidate);

  if (error instanceof Error || typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
}

function unwrapZoneError(error: unknown): unknown {
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

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useClass: PostHogErrorHandler,
  };
}
