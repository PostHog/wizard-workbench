import { ApplicationConfig, enableProdMode, ErrorHandler, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withPreloading, withRouterConfig } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

import { routes } from './app.routes';
import { environment } from '@env/environment';
import { ApiPrefixInterceptor, ErrorHandlerInterceptor } from '@core/interceptors';
import { RouteReusableStrategy } from '@core/helpers';
import { provideSocketIo } from '@core/socket-io';
import { PosthogErrorHandler } from '@core/services/posthog-error-handler.service';

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    {
      provide: ErrorHandler,
      useClass: PosthogErrorHandler,
    },

    importProvidersFrom(TranslateModule.forRoot()),

    provideSocketIo({
      rootUrl: null, // TODO: provide your own socket.io server URL
      options: {
        transports: ['websocket'],
      },
    }),

    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      scope: '/',
      registrationStrategy: 'registerWhenStable:30000',
    }),

    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
      }),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withPreloading(PreloadAllModules),
    ),

    provideHotToastConfig({
      reverseOrder: true,
      dismissible: true,
      autoClose: true,
      position: 'top-right',
      theme: 'snackbar',
    }),

    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
  ],
};
