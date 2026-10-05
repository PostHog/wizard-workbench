import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PostHogService } from '@core/services';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    console.error('ERROR', error);

    const extractedError = this.extractError(error);
    if (extractedError) {
      this.posthogService.posthog.captureException(extractedError);
    }
  }

  private extractError(errorCandidate: unknown): Error | string | null {
    const error = unwrapZonejsError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      return extractHttpError(error);
    }

    return typeof error === 'string' || isErrorOrErrorLikeObject(error) ? error : null;
  }
}

function unwrapZonejsError(error: unknown): unknown {
  return error && (error as { ngOriginalError?: unknown }).ngOriginalError
    ? (error as { ngOriginalError: unknown }).ngOriginalError
    : error;
}

function extractHttpError(error: HttpErrorResponse): Error | string {
  if (isErrorOrErrorLikeObject(error.error)) {
    return error.error;
  }

  return error.message;
}

function isErrorOrErrorLikeObject(value: unknown): value is Error {
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
