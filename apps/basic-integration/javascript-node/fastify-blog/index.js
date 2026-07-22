import Fastify from 'fastify';
import { posthog } from './posthog.js';

const fastify = Fastify({ logger: true });

async function captureRequestEvent(request, event, properties = {}) {
  posthog.capture({
    distinctId: request.headers['x-posthog-distinct-id'],
    event,
    properties: {
      $sessionId: request.headers['x-posthog-session-id'],
      $process_person_profile: false,
      ...properties,
    },
  });
  await posthog.flush();
}

fastify.setErrorHandler(async (error, request, reply) => {
  const distinctId = request.headers['x-posthog-distinct-id'];
  posthog.captureException(error, distinctId ? String(distinctId) : undefined, {
    $sessionId: request.headers['x-posthog-session-id'],
    $process_person_profile: false,
  });
  await posthog.flush();

  return fastify.errorHandler(error, request, reply);
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

  const paginatedPosts = result.slice(Number(offset), Number(offset) + Number(limit));
  await captureRequestEvent(request, 'posts_listed', {
    author_filter_applied: Boolean(author),
    limit: Number(limit),
    offset: Number(offset),
    result_count: paginatedPosts.length,
  });

  return {
    posts: paginatedPosts,
    total: result.length,
  };
});

// Create a post
fastify.post('/api/posts', async (request, reply) => {
  const { title, body, author } = request.body || {};

  if (!title || !body || !author) {
    await captureRequestEvent(request, 'post_creation_rejected', {
      has_title: Boolean(title),
      has_body: Boolean(body),
      has_author: Boolean(author),
    });
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
  await captureRequestEvent(request, 'post_created', {
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
    await captureRequestEvent(request, 'post_view_not_found');
    return reply.status(404).send({ error: 'Post not found' });
  }

  const postComments = comments.filter((c) => c.post_id === post.id);
  await captureRequestEvent(request, 'post_viewed', {
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
    await captureRequestEvent(request, 'post_update_not_found');
    return reply.status(404).send({ error: 'Post not found' });
  }

  const { title, body, published } = request.body || {};
  const changedFields = [];
  if (title !== undefined) {
    post.title = title;
    changedFields.push('title');
  }
  if (body !== undefined) {
    post.body = body;
    changedFields.push('body');
  }
  if (published !== undefined) {
    post.published = published;
    changedFields.push('published');
  }

  await captureRequestEvent(request, 'post_updated', {
    post_id: post.id,
    changed_fields: changedFields,
    published: post.published,
  });
  return post;
});

// Delete a post and its comments
fastify.delete('/api/posts/:id', async (request, reply) => {
  const index = posts.findIndex((p) => p.id === parseInt(request.params.id, 10));

  if (index === -1) {
    await captureRequestEvent(request, 'post_delete_not_found');
    return reply.status(404).send({ error: 'Post not found' });
  }

  const postId = posts[index].id;
  posts.splice(index, 1);

  let deletedCommentCount = 0;
  // Remove associated comments
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].post_id === postId) {
      comments.splice(i, 1);
      deletedCommentCount += 1;
    }
  }

  await captureRequestEvent(request, 'post_deleted', {
    post_id: postId,
    deleted_comment_count: deletedCommentCount,
  });
  return reply.status(204).send();
});

// Add a comment to a post
fastify.post('/api/posts/:id/comments', async (request, reply) => {
  const post = posts.find((p) => p.id === parseInt(request.params.id, 10));

  if (!post) {
    await captureRequestEvent(request, 'comment_post_not_found');
    return reply.status(404).send({ error: 'Post not found' });
  }

  const { author, body } = request.body || {};

  if (!author || !body) {
    await captureRequestEvent(request, 'comment_creation_rejected', {
      has_author: Boolean(author),
      has_body: Boolean(body),
    });
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
  await captureRequestEvent(request, 'comment_created', {
    comment_id: comment.id,
    post_id: comment.post_id,
    body_length: body.length,
  });
  return reply.status(201).send(comment);
});

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
