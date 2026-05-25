import posthog from 'posthog-js';
import { router } from './router.js';
import { store } from './store.js';
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderProjects } from './pages/projects.js';
import { renderProjectDetail } from './pages/project-detail.js';
import { renderSettings } from './pages/settings.js';
import { renderActivity } from './pages/activity.js';

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2026-01-30',
});

// Identify user if already logged in (page refresh)
if (store.state.currentUser) {
  const user = store.state.currentUser;
  posthog.identify(user.id, { name: user.name, email: user.email, role: user.role });
}

/**
 * Auth guard — redirects to login if no user is logged in.
 */
function requireAuth(handler) {
  return (params) => {
    if (!store.state.currentUser) {
      router.navigate('/login');
      return;
    }
    handler(params);
  };
}

// --- Routes ---

router.on('/login', renderLogin);
router.on('/dashboard', requireAuth(renderDashboard));
router.on('/projects', requireAuth(renderProjects));
router.on('/projects/:id', requireAuth(renderProjectDetail));
router.on('/activity', requireAuth(renderActivity));
router.on('/settings', requireAuth(renderSettings));

router.notFound(() => {
  if (store.state.currentUser) {
    router.navigate('/dashboard');
  } else {
    router.navigate('/login');
  }
});

// --- Start ---

router.start();
