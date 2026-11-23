import { defineMiddleware } from 'astro:middleware';
import { logPageRender } from './lib/posthog-logs';

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const acceptsHtml = request.headers.get('accept')?.includes('text/html');
  const pageType = url.pathname.startsWith('/docs/') ? 'documentation' : 'home';

  try {
    const response = await next();

    if (request.method === 'GET' && acceptsHtml) {
      logPageRender('completed', pageType);
    }

    return response;
  } catch (error) {
    if (request.method === 'GET' && acceptsHtml) {
      logPageRender('failed', pageType);
    }

    throw error;
  }
});
