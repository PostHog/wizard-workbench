import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services';

declare const Zone: {
  root?: {
    run?<T>(callback: () => T): T;
  };
} | undefined;

@Injectable({
  providedIn: 'root',
})
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    const extractedError = extractError(error);

    if (extractedError) {
      runOutsideAngular(() =>
        this.posthogService.posthog.captureException(extractedError),
      );
    }

    console.error(error);
  }
}

function extractError(errorCandidate: unknown): Error | string | null {
  const error = unwrapZoneError(errorCandidate);

  if (error instanceof HttpErrorResponse) {
    if (isErrorOrErrorLikeObject(error.error)) {
      return error.error;
    }

    return error.message;
  }

  if (typeof error === 'string' || isErrorOrErrorLikeObject(error)) {
    return error;
  }

  return null;
}

function unwrapZoneError(errorCandidate: unknown): unknown {
  if (
    errorCandidate &&
    typeof errorCandidate === 'object' &&
    'ngOriginalError' in errorCandidate
  ) {
    return (errorCandidate as { ngOriginalError: unknown }).ngOriginalError;
  }

  return errorCandidate;
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

const isNgZoneEnabled =
  typeof Zone !== 'undefined' && typeof Zone.root?.run === 'function';

function runOutsideAngular<T>(callback: () => T): T {
  return isNgZoneEnabled ? Zone.root.run(callback) : callback();
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useExisting: PostHogErrorHandler,
  };
}
