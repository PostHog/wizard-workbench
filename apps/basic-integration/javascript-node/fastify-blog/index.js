import Fastify from 'fastify';
import { emitPostHogLog, shutdownPostHogLogs } from './posthog-logs.js';
import { posthog } from './posthog.js';

const fastify = Fastify({ logger: true });

function captureEvent(request, event, properties) {
  if (!posthog) return;

  try {
    posthog.capture({ event, properties });
  } catch (captureError) {
    request.log.warn(captureError, 'Unable to capture event in PostHog');
  }
}

fastify.setErrorHandler((error, request, reply) => {
  if (posthog) {
    try {
      posthog.captureException(error);
    } catch (captureError) {
      request.log.warn(captureError, 'Unable to capture exception in PostHog');
    }
  }

  reply.send(error);
});

const posts = [];
const comments = [];
let nextPostId = 1;
let nextCommentId = 1;

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
  captureEvent(request, 'post_created', { initially_published: post.published });
  emitPostHogLog('INFO', 'Post created', { initially_published: post.published });
  return reply.status(201).send(post);
});

// Get a single post with its comments
fastify.get('/api/posts/:id', async (request, reply) => {
  const post = posts.find((p) => p.id === parseInt(request.params.id, 10));

  if (!post) {
    return reply.status(404).send({ error: 'Post not found' });
  }

  const postComments = comments.filter((c) => c.post_id === post.id);
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
  const updatedFields = [];
  if (title !== undefined) {
    post.title = title;
    updatedFields.push('title');
  }
  if (body !== undefined) {
    post.body = body;
    updatedFields.push('body');
  }
  if (published !== undefined) {
    post.published = published;
    updatedFields.push('published');
  }

  captureEvent(request, 'post_updated', {
    updated_fields: updatedFields,
    is_published: post.published,
  });

  if (!wasPublished && post.published === true) {
    captureEvent(request, 'post_published', { updated_fields: updatedFields });
    emitPostHogLog('INFO', 'Post published', { updated_field_count: updatedFields.length });
  }

  return post;
});

// Delete a post and its comments
fastify.delete('/api/posts/:id', async (request, reply) => {
  const index = posts.findIndex((p) => p.id === parseInt(request.params.id, 10));

  if (index === -1) {
    return reply.status(404).send({ error: 'Post not found' });
  }

  const postId = posts[index].id;
  const removedCommentCount = comments.filter((comment) => comment.post_id === postId).length;
  posts.splice(index, 1);

  // Remove associated comments
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].post_id === postId) comments.splice(i, 1);
  }

  captureEvent(request, 'post_deleted', { removed_comment_count: removedCommentCount });
  emitPostHogLog('INFO', 'Post deleted', { removed_comment_count: removedCommentCount });
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
  captureEvent(request, 'comment_created', {
    post_comment_count: comments.filter((item) => item.post_id === post.id).length,
  });
  return reply.status(201).send(comment);
});

const PORT = process.env.PORT || 3001;

fastify.addHook('onClose', async () => {
  await shutdownPostHogLogs();
  await posthog?.shutdown(3000).catch((shutdownError) => {
    fastify.log.warn(shutdownError, 'Unable to shut down PostHog cleanly');
  });
});

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
