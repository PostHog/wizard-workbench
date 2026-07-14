import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { PostHogService } from '@core/services';
import { Logger } from '../services/misc';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private readonly posthogService = inject(PostHogService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error) => this._errorHandler(error)));
  }

  //TODO: Customize the default error handler here if needed
  private _errorHandler(response: HttpErrorResponse): Observable<never> {
    this.posthogService.instance.capture('frontend_api_error', {
      status: response.status,
      method: response.url ? response.url.split('?')[0] : 'unknown',
      is_client_error: response.status >= 400 && response.status < 500,
    });

    this.posthogService.instance.captureException(response, {
      request_url: response.url || 'unknown',
      status: response.status,
    });

    if (!environment.production) {
      log.error('Request error', response);
    }

    return throwError(() => response);
  }
}
