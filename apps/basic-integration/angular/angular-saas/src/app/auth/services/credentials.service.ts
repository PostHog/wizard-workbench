import { computed, Injectable, inject, signal } from '@angular/core';
import { Credentials } from '@core/entities';
import { PosthogService } from '@core/services/posthog.service';

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private readonly posthogService = inject(PosthogService);

  /** The user credentials signal */
  readonly credentials = signal<Credentials | null>(this.loadCredentials());

  /** Computed signal for checking authentication status */
  readonly isAuthenticated = computed(() => !!this.credentials());

  constructor() {
    const credentials = this.credentials();
    if (credentials) {
      this.identify(credentials);
    }
  }

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
    const currentCredentials = this.credentials();

    if (currentCredentials?.id && currentCredentials.id !== credentials?.id) {
      this.posthogService.client.reset();
    }

    this.credentials.set(credentials || null);

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
      this.identify(credentials);
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  private identify(credentials: Credentials): void {
    if (!credentials.id) {
      return;
    }

    const personProperties: { email?: string; name?: string; role?: string } = {};
    const name = [credentials.firstName, credentials.lastName].filter(Boolean).join(' ');

    if (credentials.email) {
      personProperties.email = credentials.email;
    }
    if (name) {
      personProperties.name = name;
    }
    if (credentials.roles[0]) {
      personProperties.role = credentials.roles[0];
    }

    this.posthogService.client.identify(credentials.id, personProperties);
  }
}
