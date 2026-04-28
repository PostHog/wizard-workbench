import { Routes } from '@angular/router';
import { AlreadyLoggedCheckGuard } from '@app/auth/guard/authentication.guard';
import { marker } from '@colsen1991/ngx-translate-extract-marker';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [AlreadyLoggedCheckGuard],
    loadComponent: () => import('@app/auth/login/login.component').then((m) => m.LoginComponent),
    data: { title: marker('Login') },
  },
  {
    path: 'logout',
    loadComponent: () => import('@app/auth/logout/logout.component').then((m) => m.LogoutComponent),
    data: { title: marker('Logout') },
  },
];
