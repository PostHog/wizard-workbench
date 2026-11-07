import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services';

@Injectable({
  providedIn: 'root',
})
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    console.error('ERROR', error);

    const extractedError = this.extractError(error);

    if (extractedError) {
      runOutsideAngular(() =>
        this.posthogService.posthog.captureException(extractedError),
      );
    }
  }

  private extractError(errorCandidate: unknown): Error | string | null {
    const error = unwrapZoneError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      return extractHttpError(error);
    }

    if (typeof error === 'string' || isErrorLike(error)) {
      return error;
    }

    return null;
  }
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

function extractHttpError(error: HttpErrorResponse): Error | string {
  if (isErrorLike(error.error)) {
    return error.error;
  }

  if (
    typeof ErrorEvent !== 'undefined' &&
    error.error instanceof ErrorEvent &&
    error.error.message
  ) {
    return error.error.message;
  }

  return error.message;
}

function isErrorLike(value: unknown): value is Error {
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

declare const Zone: {
  root?: { run: <T>(callback: () => T) => T };
};

function runOutsideAngular<T>(callback: () => T): T {
  return typeof Zone !== 'undefined' && Zone.root?.run
    ? Zone.root.run(callback)
    : callback();
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useClass: PostHogErrorHandler,
  };
}
