import { dev } from '$app/environment';
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from '$env/static/public';
import type { HandleClientError } from '@sveltejs/kit';
import posthog from 'posthog-js';

export function init() {
	if (!PUBLIC_POSTHOG_PROJECT_TOKEN) {
		if (dev) {
			throw new Error(
				'PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
			);
		}

		return;
	}

	posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
		api_host: PUBLIC_POSTHOG_HOST,
		capture_exceptions: true
	});
}

export const handleError: HandleClientError = ({ error, status, message }) => {
	if (PUBLIC_POSTHOG_PROJECT_TOKEN) {
		posthog.captureException(error);
	}

	return { message, status };
};
