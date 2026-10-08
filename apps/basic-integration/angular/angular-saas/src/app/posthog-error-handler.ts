import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { PosthogService } from '@core/services';

@Injectable()
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PosthogService);

  handleError(error: unknown): void {
    const extractedError = extractError(error);

    if (extractedError) {
      this.posthogService.client?.captureException(extractedError);
    }

    console.error(error);
  }
}

function extractError(errorCandidate: unknown): Error | string | null {
  const error = unwrapZoneError(errorCandidate);

  if (error instanceof HttpErrorResponse) {
    if (isErrorOrErrorLike(error.error)) {
      return error.error;
    }

    return `HTTP request failed with status ${error.status}`;
  }

  return typeof error === 'string' || isErrorOrErrorLike(error) ? error : null;
}

function unwrapZoneError(error: unknown): unknown {
  return error && (error as { ngOriginalError?: unknown }).ngOriginalError
    ? (error as { ngOriginalError: unknown }).ngOriginalError
    : error;
}

function isErrorOrErrorLike(value: unknown): value is Error {
  if (value instanceof Error) {
    return true;
  }

  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'name' in value &&
    'message' in value &&
    'stack' in value
  );
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useClass: PostHogErrorHandler,
  };
}
