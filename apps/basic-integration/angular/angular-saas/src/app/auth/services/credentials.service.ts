import { computed, Injectable, inject, signal } from '@angular/core';
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
    const currentCredentials = this.credentials();
    if (!credentials && currentCredentials) {
      this.posthogService.posthog.reset();
    } else if (credentials && currentCredentials?.id && currentCredentials.id !== credentials.id) {
      this.posthogService.posthog.reset();
    }

    this.credentials.set(credentials || null);

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  /** Identifies the authenticated user after PostHog has initialized. */
  identifyCurrentUser(): void {
    const credentials = this.credentials();
    if (!credentials?.id) {
      return;
    }

    const personProperties: Record<string, string> = {};
    if (credentials.email) {
      personProperties['email'] = credentials.email;
    }
    if (credentials.fullName.trim()) {
      personProperties['name'] = credentials.fullName.trim();
    }
    if (credentials.roles[0]) {
      personProperties['role'] = credentials.roles[0];
    }

    this.posthogService.posthog.identify(credentials.id, personProperties);
  }
}
