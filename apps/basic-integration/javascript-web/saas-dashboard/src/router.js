/**
 * Simple hash-based router for vanilla JS SPA.
 *
 * Usage:
 *   router.on('/dashboard', renderDashboard)
 *   router.on('/projects/:id', renderProject)
 *   router.navigate('/dashboard')
 */
import posthog from './posthog.js';

const routes = [];
let notFoundHandler = null;

function matchRoute(path) {
  for (const route of routes) {
    const params = extractParams(route.pattern, path);
    if (params !== null) {
      return { handler: route.handler, params };
    }
  }
  return null;
}

function extractParams(pattern, path) {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

function getCurrentPath() {
  return window.location.hash.slice(1) || '/';
}

function resolve() {
  const path = getCurrentPath();
  const match = matchRoute(path);

  if (match) {
    posthog?.capture('$pageview', { $current_url: window.location.href });
    match.handler(match.params);
  } else if (notFoundHandler) {
    notFoundHandler();
  }
}

export const router = {
  on(pattern, handler) {
    routes.push({ pattern, handler });
  },

  notFound(handler) {
    notFoundHandler = handler;
  },

  navigate(path) {
    window.location.hash = path;
  },

  getCurrentPath,

  start() {
    window.addEventListener('hashchange', resolve);
    resolve();
  },
};
