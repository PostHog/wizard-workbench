import { Routes } from '@angular/router';
import { AUTH_ROUTES } from '@app/auth/auth.routing';
import { PAGES_ROUTES } from '@pages/pages-routing.module';

export const routes: Routes = [
  ...AUTH_ROUTES,
  ...PAGES_ROUTES,
  // Fallback when no prior route is matched
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
