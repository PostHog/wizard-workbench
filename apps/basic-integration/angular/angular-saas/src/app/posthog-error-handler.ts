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

  private extractError(error: unknown): Error | string | null {
    if (error instanceof HttpErrorResponse) {
      return new Error(`HTTP request failed with status ${error.status}`);
    }

    if (typeof error === 'string' || isErrorOrErrorLikeObject(error)) {
      return error;
    }

    return null;
  }
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
