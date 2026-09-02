import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CredentialsService } from '@app/auth';
import { Credentials } from '@core/entities';
import { PostHogService } from '@core/services';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
  isMobile?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly credentialsService = inject(CredentialsService);
  private readonly posthogService = inject(PostHogService);

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // Parse name from username (e.g., "johnsmith" -> "John Smith")
    const { firstName, lastName } = this.parseUsername(context.username);

    const credentials: Credentials = new Credentials({
      username: context.username,
      id: crypto.randomUUID(),
      token: '123456',
      refreshToken: '123456',
      expiresIn: 3600,
      roles: ['admin'],
      email: `${context.username}@example.com`,
      firstName,
      lastName,
    });
    this.credentialsService.setCredentials(credentials, context.remember);
    this.identifyUser(credentials);

    return of(credentials);
  }

  /**
   * Identifies the authenticated browser session with the application's stable user id.
   */
  identifyUser(credentials: Credentials): void {
    if (!credentials.id) {
      return;
    }

    this.posthogService.posthog.identify(credentials.id, {
      email: credentials.email,
      $name: credentials.fullName.trim(),
      roles: credentials.roles,
    });
  }

  /**
   * Parse username to extract first and last name.
   * Handles formats like: "johnsmith", "john.smith", "john_smith", "JohnSmith"
   */
  private parseUsername(username: string): { firstName: string; lastName: string } {
    // Check for separators (. or _)
    if (username.includes('.') || username.includes('_')) {
      const parts = username.split(/[._]/);
      return {
        firstName: this.capitalize(parts[0]),
        lastName: parts.length > 1 ? this.capitalize(parts[1]) : '',
      };
    }

    // Check for camelCase (e.g., "JohnSmith" or "johnSmith")
    const camelCaseMatch = username.match(/^([a-z]+)([A-Z][a-z]+)$/i);
    if (camelCaseMatch) {
      return {
        firstName: this.capitalize(camelCaseMatch[1]),
        lastName: this.capitalize(camelCaseMatch[2]),
      };
    }

    // Default: use entire username as first name
    return {
      firstName: this.capitalize(username),
      lastName: '',
    };
  }

  private capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<any> {
    return of(true);
  }
}
