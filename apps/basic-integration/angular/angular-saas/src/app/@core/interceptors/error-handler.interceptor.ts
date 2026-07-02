import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../services/misc';
import { PostHogService } from '../services/posthog.service';

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
  private _errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);
    }
    this.posthogService.posthog.capture('http_error_occurred', {
      status: (response as any)?.status,
      url: (response as any)?.url,
    });
    this.posthogService.posthog.captureException(response);
    throw response;
  }
}
