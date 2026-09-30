import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PostHogService } from '@core/services';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler implements ErrorHandler {
  private readonly posthogService = inject(PostHogService);
  private readonly defaultErrorHandler = new ErrorHandler();

  handleError(errorCandidate: unknown): void {
    const error = this.extractError(errorCandidate);

    if (error) {
      this.runOutsideAngular(() => this.posthogService.client.captureException(error));
    }

    this.defaultErrorHandler.handleError(errorCandidate);
  }

  private extractError(errorCandidate: unknown): Error | string | null {
    const error = this.unwrapZoneError(errorCandidate);

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof Error) {
        return error.error;
      }

      return new Error(`HTTP request failed with status ${error.status}`);
    }

    if (typeof error === 'string' || error instanceof Error) {
      return error;
    }

    if (this.isErrorLike(error)) {
      return error;
    }

    return null;
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

  private isErrorLike(value: unknown): value is Error {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      'name' in value &&
      'message' in value &&
      'stack' in value
    );
  }

  private runOutsideAngular<T>(callback: () => T): T {
    const zone = (globalThis as typeof globalThis & {
      Zone?: { root?: { run?: <R>(fn: () => R) => R } };
    }).Zone;

    return zone?.root?.run ? zone.root.run(callback) : callback();
  }
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useClass: PostHogErrorHandler,
  };
}
