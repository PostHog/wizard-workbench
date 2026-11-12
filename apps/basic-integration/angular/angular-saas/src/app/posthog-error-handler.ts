import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PostHogService } from '@core/services';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    console.error(error);

    const extractedError = extractError(error);
    if (!extractedError) {
      return;
    }

    try {
      this.posthogService.posthog.captureException(extractedError);
    } catch {
      // Error reporting must not interrupt the application error flow.
    }
  }
}

function extractError(errorCandidate: unknown): Error | string | null {
  const error = unwrapZonejsError(errorCandidate);

  if (error instanceof HttpErrorResponse) {
    return extractHttpError(error);
  }

  return typeof error === 'string' || isErrorLike(error) ? error : null;
}

function unwrapZonejsError(error: unknown): unknown {
  if (error && typeof error === 'object' && 'ngOriginalError' in error) {
    return (error as { ngOriginalError: unknown }).ngOriginalError;
  }

  return error;
}

function extractHttpError(error: HttpErrorResponse): Error | string {
  if (isErrorLike(error.error)) {
    return error.error;
  }

  if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent && error.error.message) {
    return error.error.message;
  }

  return error.message;
}

function isErrorLike(value: unknown): value is Error {
  if (value instanceof Error) {
    return true;
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return 'name' in value && 'message' in value && 'stack' in value;
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useExisting: PostHogErrorHandler,
  };
}
