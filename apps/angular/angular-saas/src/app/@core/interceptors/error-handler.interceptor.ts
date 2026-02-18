import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../services/misc';
import { PosthogService } from '../services/posthog.service';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private readonly posthogService = inject(PosthogService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error) => this._errorHandler(error)));
  }

  //TODO: Customize the default error handler here if needed
  private _errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);
    }

    if (response instanceof HttpErrorResponse) {
      this.posthogService.posthog.capture('$exception', {
        $exception_message: response.message,
        $exception_type: 'HttpErrorResponse',
        $exception_stack_trace_raw: response.error?.stack,
        http_status: response.status,
        http_url: response.url,
      });
    }

    throw response;
  }
}
