import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { PostHogService } from '@core/services';

@Injectable({
  providedIn: 'root',
})
class PostHogErrorHandler extends ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  override handleError(error: unknown): void {
    super.handleError(error);

    const extractedError = this.extractError(error);

    if (extractedError) {
      this.posthogService.client?.captureException(extractedError);
    }
  }

  private extractError(errorCandidate: unknown): Error | string | null {
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
    if (error && typeof error === 'object' && 'ngOriginalError' in error) {
      return (error as { ngOriginalError: unknown }).ngOriginalError;
    }

    return error;
  }

  private extractHttpError(error: HttpErrorResponse): Error | string {
    if (this.isErrorLike(error.error)) {
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

  private isErrorLike(value: unknown): value is Error {
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
