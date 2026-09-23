import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PostHogService } from '@core/services/posthog.service';

@Injectable({ providedIn: 'root' })
export class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    console.error('ERROR', error);

    const extractedError = this.extractError(error);

    if (extractedError) {
      this.posthogService.posthog.captureException(extractedError);
    }
  }

  private extractError(errorCandidate: unknown): string | Error | null {
    const error = this.unwrapZoneError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      return this.extractHttpError(error);
    }

    if (typeof error === 'string' || this.isErrorLike(error)) {
      return error;
    }

    return null;
  }

  private unwrapZoneError(error: unknown): unknown {
    if (
      error &&
      typeof error === 'object' &&
      'ngOriginalError' in error &&
      error.ngOriginalError
    ) {
      return error.ngOriginalError;
    }

    return error;
  }

  private extractHttpError(error: HttpErrorResponse): string | Error {
    if (this.isErrorLike(error.error)) {
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
      return `Server returned code ${error.status} with body "${error.error}"`;
    }

    return error.message;
  }

  private isErrorLike(value: unknown): value is Error {
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
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useExisting: PostHogErrorHandler,
  };
}
