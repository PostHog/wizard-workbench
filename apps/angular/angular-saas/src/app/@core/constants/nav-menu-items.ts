import { PERMISSIONS } from '../../auth/enums/permissions.enum';
import { NavMenuItem } from '@core/interfaces';

// THIS FILE CONTAINS THE NAVIGATION MENU ITEMS FOR THE SIDEBAR AND ALL OTHER NAVIGATION MENUS WHICH ARE USED IN THE APPLICATION AND ARE CONSTANT

/**
 * Navigation menu items for WEB Sidebar
 */
export const webSidebarMenuItems: NavMenuItem[] = [
  {
    href: '/dashboard',
    title: 'Dashboard',
    active: true,
    icon: '🏠',
  },
  {
    href: '/users',
    title: 'Team',
    active: false,
    icon: '👥',
    permissions: [PERMISSIONS.ACCESS_USER],
  },
  {
    href: '/billing',
    title: 'Billing',
    active: false,
    icon: '💳',
    divider: true,
  },
  {
    href: '/settings',
    title: 'Settings',
    active: false,
    icon: '⚙️',
  },
];
