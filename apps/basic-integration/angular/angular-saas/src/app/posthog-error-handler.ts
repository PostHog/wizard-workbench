import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PostHogService } from '@core/services';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  handleError(error: unknown): void {
    const extractedError = this.extractError(error) || 'Unknown error';
    this.posthogService.client?.captureException(extractedError);
  }

  private extractError(error: unknown): unknown | null {
    if (error instanceof HttpErrorResponse) {
      return extractHttpModuleError(error);
    }

    if (typeof error === 'string' || isErrorOrErrorLikeObject(error)) {
      return error;
    }

    return null;
  }
}

function extractHttpModuleError(error: HttpErrorResponse): string | Error {
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

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useClass: PostHogErrorHandler,
  };
}
