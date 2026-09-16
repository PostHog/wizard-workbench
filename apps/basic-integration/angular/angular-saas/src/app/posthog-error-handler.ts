import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PostHogService } from '@core/services';

@Injectable()
export class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    const extractedError = this.extractError(error);

    if (extractedError) {
      this.posthogService.posthog.captureException(extractedError);
    }

    console.error(error);
  }

  private extractError(error: unknown): Error | string | null {
    if (error instanceof HttpErrorResponse) {
      return extractHttpError(error);
    }

    if (typeof error === 'string' || isErrorOrErrorLikeObject(error)) {
      return error;
    }

    return null;
  }
}

function extractHttpError(error: HttpErrorResponse): Error | string {
  if (isErrorOrErrorLikeObject(error.error)) {
    return error.error;
  }

  if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent && error.error.message) {
    return error.error.message;
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

