import Fastify from 'fastify';
import { PostHog } from 'posthog-node';

const fastify = Fastify({ logger: true });

const posts = [];
const comments = [];
let nextPostId = 1;
let nextCommentId = 1;

// --- PostHog Setup ---

function initializePosthog() {
  const apiKey = process.env.POSTHOG_API_KEY;

  if (!apiKey) {
    console.log('WARNING: PostHog not configured (POSTHOG_API_KEY not set)');
    console.log("         App will work but analytics won't be tracked");
    return null;
  }

  const client = new PostHog(apiKey, {
    host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
    enableExceptionAutocapture: true,
  });

  return client;
}

const posthog = initializePosthog();

function trackEvent(distinctId, event, properties = {}) {
  if (!posthog) return;

  posthog.capture({
    distinctId,
    event,
    properties,
  });
}

function identifyUser(distinctId, properties = {}) {
  if (!posthog) return;

  posthog.identify({
    distinctId,
    properties,
  });
}

// --- Routes ---

// List posts (with optional author filter and pagination)
fastify.get('/api/posts', async (request) => {
  let result = posts;
  const { author, limit = 20, offset = 0 } = request.query;

  if (author) {
    result = result.filter((p) => p.author === author);
  }

  return {
    posts: result.slice(Number(offset), Number(offset) + Number(limit)),
    total: result.length,
  };
});

// Create a post
fastify.post('/api/posts', async (request, reply) => {
  const { title, body, author } = request.body || {};

  if (!title || !body || !author) {
    return reply.status(400).send({ error: 'title, body, and author are required' });
  }

  const post = {
    id: nextPostId++,
    title,
    body,
    author,
    published: false,
    created_at: new Date().toISOString(),
  };
  posts.push(post);

  identifyUser(author, {
    last_active: new Date().toISOString(),
    total_posts_created: posts.filter((p) => p.author === author).length,
  });

  trackEvent(author, 'post_created', {
    post_id: post.id,
    title_length: title.length,
    body_length: body.length,
    total_posts: posts.length,
  });

  return reply.status(201).send(post);
});

// Get a single post with its comments
fastify.get('/api/posts/:id', async (request, reply) => {
  const post = posts.find((p) => p.id === parseInt(request.params.id, 10));

  if (!post) {
    return reply.status(404).send({ error: 'Post not found' });
  }

  const postComments = comments.filter((c) => c.post_id === post.id);

  trackEvent(post.author, 'post_viewed', {
    post_id: post.id,
    comment_count: postComments.length,
    published: post.published,
  });

  return { ...post, comments: postComments };
});

// Update a post
fastify.patch('/api/posts/:id', async (request, reply) => {
  const post = posts.find((p) => p.id === parseInt(request.params.id, 10));

  if (!post) {
    return reply.status(404).send({ error: 'Post not found' });
  }

  const { title, body, published } = request.body || {};
  const wasPublished = post.published;
  if (title !== undefined) post.title = title;
  if (body !== undefined) post.body = body;
  if (published !== undefined) post.published = published;

  if (published === true && !wasPublished) {
    trackEvent(post.author, 'post_published', {
      post_id: post.id,
      title_length: post.title.length,
      body_length: post.body.length,
    });
  } else if (title !== undefined || body !== undefined) {
    trackEvent(post.author, 'post_updated', {
      post_id: post.id,
      fields_updated: [title !== undefined && 'title', body !== undefined && 'body'].filter(Boolean),
    });
  }

  return post;
});

// Delete a post and its comments
fastify.delete('/api/posts/:id', async (request, reply) => {
  const index = posts.findIndex((p) => p.id === parseInt(request.params.id, 10));

  if (index === -1) {
    return reply.status(404).send({ error: 'Post not found' });
  }

  const post = posts[index];
  const postId = post.id;
  const commentCount = comments.filter((c) => c.post_id === postId).length;

  posts.splice(index, 1);

  // Remove associated comments
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].post_id === postId) comments.splice(i, 1);
  }

  trackEvent(post.author, 'post_deleted', {
    post_id: postId,
    was_published: post.published,
    comment_count: commentCount,
  });

  return reply.status(204).send();
});

// Add a comment to a post
fastify.post('/api/posts/:id/comments', async (request, reply) => {
  const post = posts.find((p) => p.id === parseInt(request.params.id, 10));

  if (!post) {
    return reply.status(404).send({ error: 'Post not found' });
  }

  const { author, body } = request.body || {};

  if (!author || !body) {
    return reply.status(400).send({ error: 'author and body are required' });
  }

  const comment = {
    id: nextCommentId++,
    post_id: post.id,
    author,
    body,
    created_at: new Date().toISOString(),
  };
  comments.push(comment);

  identifyUser(author, {
    last_active: new Date().toISOString(),
  });

  trackEvent(author, 'comment_added', {
    comment_id: comment.id,
    post_id: post.id,
    post_author: post.author,
    body_length: body.length,
  });

  return reply.status(201).send(comment);
});

// --- Error Handling ---

// Global error handler — capture exceptions to PostHog
fastify.setErrorHandler((err, request, reply) => {
  const distinctId = request.body?.author || request.query?.author || 'anonymous';

  if (posthog) {
    posthog.captureException(err, distinctId);
  }

  fastify.log.error(err);
  reply.status(500).send({ error: 'Internal server error' });
});

// --- Server ---

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

// Graceful shutdown — flush PostHog events before exiting
async function shutdown() {
  console.log('\nShutting down...');
  await fastify.close();
  if (posthog) {
    await posthog.shutdown();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
