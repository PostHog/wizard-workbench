import posthog from 'posthog-js';
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

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogKey) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured',
    );
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured',
    );
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });

  const user = store.state.currentUser;
  if (user) {
    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }
}

router.start();
