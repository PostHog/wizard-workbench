import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services';

@Injectable({ providedIn: 'root' })
export class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    const extractedError = this.extractError(error) ?? new Error('Unknown error');

    runOutsideAngular(() => this.posthogService.posthog.captureException(extractedError));
    console.error(error);
  }

  private extractError(errorCandidate: unknown): unknown | null {
    const error = unwrapZoneJsError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      return extractHttpError(error);
    }

    if (typeof error === 'string' || isErrorOrErrorLikeObject(error)) {
      return error;
    }

    return null;
  }
}

function unwrapZoneJsError(error: unknown): unknown {
  return error && (error as { ngOriginalError?: unknown }).ngOriginalError
    ? (error as { ngOriginalError: unknown }).ngOriginalError
    : error;
}

function extractHttpError(error: HttpErrorResponse): string | Error {
  if (isErrorOrErrorLikeObject(error.error)) {
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

function isErrorOrErrorLikeObject(value: unknown): value is Error {
  if (value instanceof Error) {
    return true;
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return 'name' in value && 'message' in value && 'stack' in value;
}

declare const Zone: any;
const isNgZoneEnabled = typeof Zone !== 'undefined' && Zone.root?.run;

function runOutsideAngular<T>(callback: () => T): T {
  return isNgZoneEnabled ? Zone.root.run(callback) : callback();
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useExisting: PostHogErrorHandler,
  };
}
