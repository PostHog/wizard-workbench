import { InjectionToken, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { SocketIoConfig } from './config/socket-io.config';
import { WrappedSocket } from './socket-io.service';

/** Socket factory */
export function SocketFactory(config: SocketIoConfig) {
  return new WrappedSocket(config);
}

export const SOCKET_CONFIG_TOKEN = new InjectionToken<SocketIoConfig>('__SOCKET_IO_CONFIG__');

/**
 * Provides SocketIO configuration for the application.
 * @param config The SocketIO configuration
 * @returns Environment providers for SocketIO
 */
export function provideSocketIo(config: SocketIoConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SOCKET_CONFIG_TOKEN, useValue: config },
    {
      provide: WrappedSocket,
      useFactory: SocketFactory,
      deps: [SOCKET_CONFIG_TOKEN],
    },
  ]);
}
