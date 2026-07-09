import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, PostHogService } from '../services';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private readonly posthogService: PostHogService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error) => this._errorHandler(error)));
  }

  //TODO: Customize the default error handler here if needed
  private _errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    this.posthogService.captureException(response, {
      source: 'http_interceptor',
    });

    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);
    }
    throw response;
  }
}
