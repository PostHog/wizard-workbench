import { computed, inject, Injectable, signal } from '@angular/core';
import { Credentials } from '@core/entities';
import { PostHogService } from '@core/services';

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private readonly posthogService = inject(PostHogService);

  /** The user credentials signal */
  readonly credentials = signal<Credentials | null>(this.loadCredentials());

  /** Computed signal for checking authentication status */
  readonly isAuthenticated = computed(() => !!this.credentials());

  private loadCredentials(): Credentials | null {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    return savedCredentials ? JSON.parse(savedCredentials) : null;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember = true) {
    const previousCredentials = this.credentials();

    if (!credentials && previousCredentials) {
      this.posthogService.logInfo('authenticated session cleared', {
        lifecycle_stage: 'logout',
      });
      this.posthogService.client.reset();
    } else if (credentials && previousCredentials?.id && previousCredentials.id !== credentials.id) {
      this.posthogService.client.reset();
    }

    this.credentials.set(credentials || null);

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
      this.identifyCurrentUser();
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  identifyCurrentUser(): void {
    const credentials = this.credentials();
    if (!credentials?.id) {
      return;
    }

    const name = [credentials.firstName, credentials.lastName].filter(Boolean).join(' ');
    const personProperties = {
      ...(credentials.username ? { username: credentials.username } : {}),
      ...(credentials.email ? { email: credentials.email } : {}),
      ...(name ? { name } : {}),
      ...(credentials.roles.length ? { roles: credentials.roles } : {}),
    };

    this.posthogService.client.identify(credentials.id, personProperties);
    this.posthogService.logInfo('authenticated session identified', {
      identity_source: 'credentials',
    });
  }
}
