import { ErrorHandler, Injectable } from '@angular/core';
import posthog from 'posthog-js';

@Injectable()
export class PostHogErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    posthog.captureException(error);
    console.error(error);
  }
}
