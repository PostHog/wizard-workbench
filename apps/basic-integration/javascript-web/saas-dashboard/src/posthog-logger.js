import posthog from 'posthog-js';

const posthogEnabled = Boolean(
  import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST,
);

export const posthogLogger = {
  info(body, attributes) {
    if (posthogEnabled) {
      posthog.captureLog({ body, level: 'info', attributes });
    }
  },
};
