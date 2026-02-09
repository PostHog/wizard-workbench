import { Routes } from '@angular/router';
import { Shell } from '@app/shell/services/shell.service';

export const PAGES_ROUTES: Routes = [
  Shell.childRoutes([
    {
      path: 'dashboard',
      loadComponent: () => import('@pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    },
    {
      path: 'profile',
      loadComponent: () => import('@pages/profile/profile.component').then((m) => m.ProfileComponent),
    },
    {
      path: 'settings',
      loadComponent: () => import('@pages/settings/settings.component').then((m) => m.SettingsComponent),
      children: [
        { path: '', redirectTo: 'account', pathMatch: 'full' },
        {
          path: 'account',
          loadComponent: () => import('@pages/settings/components/account-settings/account-settings.component').then((m) => m.AccountSettingsComponent),
        },
        {
          path: 'preferences',
          loadComponent: () => import('@pages/settings/components/preferences-settings/preferences-settings.component').then((m) => m.PreferencesSettingsComponent),
        },
        {
          path: 'notifications',
          loadComponent: () => import('@pages/settings/components/notification-settings/notification-settings.component').then((m) => m.NotificationSettingsComponent),
        },
        {
          path: 'security',
          loadComponent: () => import('@pages/settings/components/security-settings/security-settings.component').then((m) => m.SecuritySettingsComponent),
        },
      ],
    },
    {
      path: 'billing',
      loadComponent: () => import('@pages/billing/billing.component').then((m) => m.BillingComponent),
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.routes').then((m) => m.USERS_ROUTES),
    },

    // Fallback when no prior route is matched
    { path: '**', redirectTo: '', pathMatch: 'full' },
  ]),
];
