import 'dotenv/config';
import { createHash } from 'node:crypto';
import Fastify from 'fastify';
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
  flushAt: 1,
  flushInterval: 0,
});

const fastify = Fastify({ logger: true });

const posts = [];
const comments = [];
let nextPostId = 1;
let nextCommentId = 1;

function getDistinctId(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

async function captureEvent(distinctId, event, properties = {}) {
  posthog.capture({
    distinctId,
    event,
    properties,
  });

  await posthog.flush();
}

fastify.setErrorHandler(async (err, request, reply) => {
  const distinctId = request.body?.author ? getDistinctId(request.body.author) : 'anonymous';

  posthog.captureException(err, distinctId, {
    path: request.routerPath || request.url,
    method: request.method,
  });
  await posthog.flush();

  request.log.error(err);

  if (!reply.sent) {
    reply.status(err.statusCode || 500).send({ error: 'Internal Server Error' });
  }
});

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

  await captureEvent(getDistinctId(author), 'post_created', {
    post_id: post.id,
    title_length: title.length,
    body_length: body.length,
    published: post.published,
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

  await captureEvent(getDistinctId(post.author), 'post_viewed', {
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
  if (title !== undefined) post.title = title;
  if (body !== undefined) post.body = body;
  if (published !== undefined) post.published = published;

  await captureEvent(getDistinctId(post.author), 'post_updated', {
    post_id: post.id,
    title_updated: title !== undefined,
    body_updated: body !== undefined,
    published_updated: published !== undefined,
    published: post.published,
  });

  return post;
});

// Delete a post and its comments
fastify.delete('/api/posts/:id', async (request, reply) => {
  const index = posts.findIndex((p) => p.id === parseInt(request.params.id, 10));

  if (index === -1) {
    return reply.status(404).send({ error: 'Post not found' });
  }

  const deletedPost = posts[index];
  const postId = deletedPost.id;
  posts.splice(index, 1);

  let deletedCommentCount = 0;

  // Remove associated comments
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].post_id === postId) {
      comments.splice(i, 1);
      deletedCommentCount++;
    }
  }

  await captureEvent(getDistinctId(deletedPost.author), 'post_deleted', {
    post_id: postId,
    deleted_comment_count: deletedCommentCount,
    published: deletedPost.published,
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

  await captureEvent(getDistinctId(author), 'comment_created', {
    comment_id: comment.id,
    post_id: post.id,
    body_length: body.length,
    post_author_matches_comment_author: post.author === author,
  });

  return reply.status(201).send(comment);
});

fastify.addHook('onClose', async () => {
  await posthog.shutdown();
});

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
