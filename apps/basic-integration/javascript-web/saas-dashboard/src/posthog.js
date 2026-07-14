import posthog from 'posthog-js';
import { router } from './router.js';

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

const isConfigured = Boolean(posthogKey && posthogHost);
let initialized = false;

function getRouteContext() {
  return {
    route: router.getCurrentPath(),
  };
}

export function initPostHog() {
  if (!isConfigured || initialized) {
    return;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-05-30',
    capture_pageview: false,
    capture_pageleave: true,
    capture_exceptions: true,
  });

  initialized = true;
}

export function identifyCurrentUser(user) {
  if (!isConfigured || !user?.id) {
    return;
  }

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetPostHogUser() {
  if (!isConfigured) {
    return;
  }

  posthog.reset();
}

export function captureEvent(eventName, properties = {}) {
  if (!isConfigured || !initialized) {
    return;
  }

  posthog.capture(eventName, {
    ...getRouteContext(),
    ...properties,
  });
}

export function captureException(error, properties = {}) {
  if (!isConfigured || !initialized) {
    return;
  }

  posthog.captureException(error, {
    ...getRouteContext(),
    ...properties,
  });
}
