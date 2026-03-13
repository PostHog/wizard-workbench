import { PostHog } from 'posthog-node';

const client = new PostHog(process.env.POSTHOG_KEY, {
  host: process.env.POSTHOG_HOST,
});

export default client;
