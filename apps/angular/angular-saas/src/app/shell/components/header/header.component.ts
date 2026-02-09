import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth/services/credentials.service';
import { ThemeService } from '@app/shell/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly credentialsService = inject(CredentialsService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  readonly menuHidden = signal(true);
  readonly isDarkTheme = signal(false);

  readonly user = computed(() => this.credentialsService.credentials());

  readonly userInitials = computed(() => {
    const user = this.user();
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  });

  toggleMenu() {
    this.menuHidden.update((hidden) => !hidden);
  }

  toggleTheme() {
    this.isDarkTheme.update((dark) => {
      const newValue = !dark;
      if (newValue) {
        this.themeService.setDarkTheme();
      } else {
        this.themeService.setLightTheme();
      }
      return newValue;
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
    this.menuHidden.set(true);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
    this.menuHidden.set(true);
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}
