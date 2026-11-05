import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';

import { PosthogService } from '@core/services';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PosthogService);
  private readonly defaultErrorHandler = new ErrorHandler();

  handleError(error: unknown): void {
    const extractedError = this.extractError(error) || 'Unknown error';
    this.posthogService.posthog.captureException(extractedError);
    this.defaultErrorHandler.handleError(error);
  }

  private extractError(errorCandidate: unknown): unknown {
    const error = this.unwrapZonejsError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      return this.extractHttpError(error);
    }

    if (typeof error === 'string' || this.isErrorOrErrorLikeObject(error)) {
      return error;
    }

    return null;
  }

  private unwrapZonejsError(error: unknown): unknown | Error {
    return error && (error as { ngOriginalError?: Error }).ngOriginalError
      ? (error as { ngOriginalError: Error }).ngOriginalError
      : error;
  }

  private extractHttpError(error: HttpErrorResponse): string | Error {
    if (this.isErrorOrErrorLikeObject(error.error)) {
      return error.error;
    }

    if (
      typeof ErrorEvent !== 'undefined' &&
      error.error instanceof ErrorEvent &&
      error.error.message
    ) {
      return error.error.message;
    }

    if (typeof error.error === 'string') {
      return `Server returned code ${error.status}`;
    }

    return error.message;
  }

  private isErrorOrErrorLikeObject(value: unknown): value is Error {
    if (value instanceof Error) {
      return true;
    }

    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }

    return 'name' in value && 'message' in value && 'stack' in value;
  }
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useExisting: PostHogErrorHandler,
  };
}
