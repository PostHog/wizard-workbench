import posthog from './posthog.js';
import { router } from './router.js';
import { store } from './store.js';
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderProjects } from './pages/projects.js';
import { renderProjectDetail } from './pages/project-detail.js';
import { renderSettings } from './pages/settings.js';
import { renderActivity } from './pages/activity.js';

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

// Re-identify the user if they're already logged in (e.g. after a page refresh)
if (store.state.currentUser) {
  const u = store.state.currentUser;
  posthog.identify(u.id, { email: u.email, name: u.name, role: u.role });
}

router.start();
