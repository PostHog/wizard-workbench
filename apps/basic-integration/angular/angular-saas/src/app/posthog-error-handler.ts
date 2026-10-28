import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services';

@Injectable()
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    const exception = unwrapAngularError(error);

    if (exception instanceof Error) {
      this.posthogService.client.captureException(exception);
    }

    console.error(error);
  }
}

function unwrapAngularError(error: unknown): unknown {
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
