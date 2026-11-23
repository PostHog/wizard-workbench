import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler extends ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  override handleError(error: unknown): void {
    const extractedError = this.extractError(error);

    if (extractedError) {
      this.posthogService.posthog.captureException(extractedError);
    }

    super.handleError(error);
  }

  private extractError(errorCandidate: unknown): unknown {
    const error = this.unwrapZoneError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      return this.extractHttpError(error);
    }

    return typeof error === 'string' || this.isErrorLike(error) ? error : null;
  }

  private unwrapZoneError(errorCandidate: unknown): unknown {
    if (
      errorCandidate &&
      typeof errorCandidate === 'object' &&
      'ngOriginalError' in errorCandidate
    ) {
      return (errorCandidate as { ngOriginalError: unknown }).ngOriginalError;
    }

    return errorCandidate;
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
    useClass: PostHogErrorHandler,
  };
}
