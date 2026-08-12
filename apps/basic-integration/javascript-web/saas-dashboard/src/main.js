import posthog from 'posthog-js';
import { router } from './router.js';
import { store } from './store.js';
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderProjects } from './pages/projects.js';
import { renderProjectDetail } from './pages/project-detail.js';
import { renderSettings } from './pages/settings.js';
import { renderActivity } from './pages/activity.js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: 'history_change',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    defaults: '2026-05-30',
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogKey ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_KEY';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

const currentUser = store.state.currentUser;
if (posthogKey && posthogHost && currentUser?.id) {
  posthog.identify(currentUser.id, {
    email: currentUser.email,
    name: currentUser.name,
    role: currentUser.role,
  });
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
