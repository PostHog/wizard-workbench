import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { PostHogService } from '@core/services/posthog.service';

@Injectable({ providedIn: 'root' })
export class PostHogErrorHandler extends ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  override handleError(error: unknown): void {
    const extractedError = extractError(error) ?? 'Unknown error';

    this.posthogService.posthog.captureException(extractedError);
    super.handleError(error);
  }
}

function extractError(errorCandidate: unknown): unknown {
  const error = unwrapZoneError(errorCandidate);

  if (error instanceof HttpErrorResponse) {
    return extractHttpError(error);
  }

  return typeof error === 'string' || isErrorLike(error) ? error : null;
}

function unwrapZoneError(error: unknown): unknown {
  return error && typeof error === 'object' && 'ngOriginalError' in error
    ? (error as { ngOriginalError: unknown }).ngOriginalError
    : error;
}

function extractHttpError(error: HttpErrorResponse): string | Error {
  if (isErrorLike(error.error)) {
    return error.error;
  }

  if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent && error.error.message) {
    return error.error.message;
  }

  return error.message;
}

function isErrorLike(value: unknown): value is Error {
  if (value instanceof Error) {
    return true;
  }

  return value !== null && typeof value === 'object' && !Array.isArray(value) && 'name' in value && 'message' in value && 'stack' in value;
}
