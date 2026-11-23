import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import type { HandleClientError } from '@sveltejs/kit';
import posthog from 'posthog-js';

let posthogInitialized = false;

export async function init() {
	const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN;

	if (!token) {
		if (dev) {
			console.error(
				'PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
			);
		}
		return;
	}

	posthog.init(token, {
		api_host: env.PUBLIC_POSTHOG_HOST,
		defaults: '2025-05-24',
		capture_exceptions: true
	});
	posthogInitialized = true;
}

export const handleError: HandleClientError = ({ error, status }) => {
	if (posthogInitialized && status !== 404) {
		posthog.captureException(error);
	}
};
