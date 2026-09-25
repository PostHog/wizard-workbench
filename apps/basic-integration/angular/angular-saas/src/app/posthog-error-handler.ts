import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';

import { PostHogService } from '@core/services';

@Injectable({ providedIn: 'root' })
export class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    const extractedError = extractError(error) ?? 'Unknown error';

    runOutsideAngular(() => {
      this.posthogService.posthog.captureException(extractedError);
    });
    console.error('ERROR', error);
  }
}

function extractError(errorCandidate: unknown): unknown | null {
  const error = unwrapZoneError(errorCandidate);

  if (error instanceof HttpErrorResponse) {
    return extractHttpError(error);
  }

  return typeof error === 'string' || isErrorLike(error) ? error : null;
}

function unwrapZoneError(error: unknown): unknown {
  return error && typeof error === 'object' && 'ngOriginalError' in error
    ? (error as { ngOriginalError: unknown }).ngOriginalError
    : error;
}

function extractHttpError(error: HttpErrorResponse): string | Error {
  if (isErrorLike(error.error)) {
    return error.error;
  }

  if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent && error.error.message) {
    return error.error.message;
  }

  if (typeof error.error === 'string') {
    return `Server returned code ${error.status} with body "${error.error}"`;
  }

  return error.message;
}

function isErrorLike(value: unknown): value is Error {
  return value instanceof Error || (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'name' in value &&
    'message' in value &&
    'stack' in value
  );
}

declare const Zone: any;
const isNgZoneEnabled = typeof Zone !== 'undefined' && Zone.root?.run;

function runOutsideAngular<T>(callback: () => T): T {
  return isNgZoneEnabled ? Zone.root.run(callback) : callback();
}
