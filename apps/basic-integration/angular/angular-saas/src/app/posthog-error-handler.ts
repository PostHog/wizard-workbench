import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone, Provider, inject } from '@angular/core';
import { PosthogService } from '@core/services/posthog.service';

@Injectable({ providedIn: 'root' })
class PosthogErrorHandler extends ErrorHandler {
  private readonly ngZone = inject(NgZone);
  private readonly posthogService = inject(PosthogService);

  override handleError(error: unknown): void {
    super.handleError(error);

    const extractedError = extractError(error);

    if (extractedError) {
      this.ngZone.runOutsideAngular(() => {
        this.posthogService.client?.captureException(extractedError);
      });
    }
  }
}

function extractError(errorCandidate: unknown): Error | string | null {
  const error = unwrapZoneError(errorCandidate);

  if (error instanceof HttpErrorResponse) {
    return extractHttpError(error);
  }

  if (typeof error === 'string' || isErrorLike(error)) {
    return error;
  }

  return null;
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

function extractHttpError(error: HttpErrorResponse): Error | string {
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
  if (value instanceof Error) {
    return true;
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return 'name' in value && 'message' in value && 'stack' in value;
}

export function providePosthogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useExisting: PosthogErrorHandler,
  };
}
