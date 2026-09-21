import { computed, Injectable, inject, signal } from '@angular/core';
import { Credentials } from '@core/entities';
import { PostHogService } from '@core/services/posthog.service';

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
  private identifiedUserId: string | null = null;

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
    const hadCredentials = this.isAuthenticated();
    this.credentials.set(credentials || null);

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
      this.identifyCurrentUser();
    } else {
      if (hadCredentials || this.identifiedUserId) {
        this.posthogService.posthog.reset();
      }
      this.identifiedUserId = null;
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  identifyCurrentUser(): void {
    const credentials = this.credentials();
    if (!credentials?.id) {
      return;
    }

    if (this.identifiedUserId && this.identifiedUserId !== credentials.id) {
      this.posthogService.posthog.reset();
    }

    const fullName = credentials.fullName.trim();
    this.posthogService.posthog.identify(credentials.id, {
      username: credentials.username,
      roles: credentials.roles,
      ...(credentials.email ? { $email: credentials.email } : {}),
      ...(fullName ? { $name: fullName } : {}),
    });
    this.identifiedUserId = credentials.id;
  }
}
