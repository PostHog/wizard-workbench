import { defineMiddleware } from 'astro:middleware';
import { logDocumentationServed } from './lib/posthog-logs';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const { pathname } = new URL(context.request.url);

  if (context.request.method === 'GET' && response.status < 400) {
    logDocumentationServed(pathname, response.status);
  }

  return response;
});
