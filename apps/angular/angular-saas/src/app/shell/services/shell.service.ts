import { Route, Router, Routes } from '@angular/router';

import { AuthenticationGuard, PERMISSIONS, PermissionService } from '@app/auth';
import { ShellComponent } from '@app/shell/shell.component';
import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NavMenuItem } from '@core/interfaces';

/**
 * Provides helper methods to create routes.
 */
export class Shell {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],

      data: { reuse: true },
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShellService {
  private readonly router = inject(Router);
  private readonly permissionService = inject(PermissionService);

  /** Current navigation mode signal */
  readonly navMode = signal<NavMode>(NavMode.Free);

  /** Observable bridge for legacy consumers */
  readonly navMode$ = toObservable(this.navMode);

  allowedAccess(item: NavMenuItem): boolean {
    if (item.roles && item.roles.length) {
      return item.roles.includes(this.permissionService.userRole());
    }

    if (item.permissions && item.permissions.length) {
      return item.permissions.some((permission: PERMISSIONS) => this.permissionService.hasPermission(permission));
    }

    return true;
  }

  toggleNavMode(): void {
    this.navMode.update((mode) => (mode === NavMode.Free ? NavMode.Locked : NavMode.Free));
  }

  activeNavTab(items: NavMenuItem[], extendedItem: number): void {
    items.forEach((item, index) => {
      if (item.href) {
        const urlSegments = this.router.url.split('/').filter((segment) => segment.length > 0);
        const hrefSegments = item.href.split('/').filter((segment) => segment.length > 0);
        const isActive = hrefSegments.every((segment, i) => segment === urlSegments[i]);

        item.active = isActive;

        if (isActive && extendedItem) {
          extendedItem = index;
        }

        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            if (subItem.href) {
              const subItemHrefSegments = subItem.href.split('/').filter((segment) => segment.length > 0);
              subItem.active = subItemHrefSegments.every((segment, i) => segment === urlSegments[i]);
            }
          });
        }
      } else {
        item.active = false;
      }
    });
  }

  activateNavItem(index: number, navItems: NavMenuItem[]): void {
    const item = navItems[index];
    if (item.disabled) return;

    // Use requestAnimationFrame for DOM operations (zoneless-compatible)
    requestAnimationFrame(() => {
      const element = document.getElementById(`menu-item-${index}`);
      const navElement = document.querySelector('nav');

      if (element && navElement) {
        const elementRect = element.getBoundingClientRect();
        const navRect = navElement.getBoundingClientRect();

        const relativeTop = elementRect.top - navRect.top;
        const desiredScrollPosition = navElement.scrollTop + relativeTop - navRect.height / 2;

        navElement.scrollTo({ top: desiredScrollPosition, behavior: 'smooth' });
      }
    });

    if (item && (!item.subItems || !item.subItems.length)) {
      this.router.navigate([item.href]);
    } else {
      // set false to all subitems of all items
      navItems.forEach((item) => {
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            subItem.active = false;
          });
        }
      });
    }
  }

  activateNavSubItem(i: number, subItem: NavMenuItem, sidebarItems: NavMenuItem[]) {
    if (subItem.disabled) return;
    subItem.active = true;
    sidebarItems[i].active = true;
    // disable all other subitems
    sidebarItems[i].subItems.forEach((item) => {
      if (item !== subItem) {
        item.active = false;
      }
    });
    if (subItem.href) {
      this.router.navigate([subItem.href]);
    }

    if (subItem.url) {
      window.open(subItem.url, '_blank');
    }
  }

  getCurrentActiveRoute(lastSegmentOnly = true): string {
    const url = this.router.url;
    const urlSegments = url.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    return lastSegmentOnly ? lastSegment : url;
  }
}

export enum NavMode {
  Locked,
  Free,
}
