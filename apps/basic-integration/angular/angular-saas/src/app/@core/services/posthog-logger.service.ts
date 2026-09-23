import { Injectable, inject } from '@angular/core';
import { PostHogService } from './posthog.service';

@Injectable({ providedIn: 'root' })
export class PostHogLoggerService {
  private readonly posthogService = inject(PostHogService);

  applicationInitialized(): void {
    this.posthogService.posthog?.logger.info('application initialized', { runtime: 'browser' });
  }

  authenticationSucceeded(): void {
    this.posthogService.posthog?.logger.info('authentication succeeded', { authentication_method: 'password' });
  }

  projectCreated(status: 'active' | 'on-hold' | 'completed'): void {
    this.posthogService.posthog?.logger.info('project created', { project_status: status });
  }
}
