import Fastify from 'fastify';
import { PostHog } from 'posthog-node';

const fastify = Fastify({ logger: true });
const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

const posthog = posthogApiKey
  ? new PostHog(posthogApiKey, {
      host: posthogHost,
      enableExceptionAutocapture: true,
    })
  : null;

function getDistinctId(request, fallback) {
  const headerDistinctId = request.headers['x-posthog-distinct-id'];
  if (typeof headerDistinctId === 'string' && headerDistinctId.trim()) {
    return headerDistinctId;
  }

  if (fallback && typeof fallback === 'string') {
    return `author:${fallback.toLowerCase().trim().replace(/\s+/g, '-')}`;
  }

  const forwardedFor = request.headers['x-forwarded-for'];
  const requestSource = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0]
      : request.ip;

  return `anonymous:${requestSource || 'unknown'}`;
}

function captureEvent(request, event, distinctId, properties = {}) {
  if (!posthog) {
    return;
  }

  posthog.capture({
    distinctId,
    event,
    properties: {
      path: request.routerPath || request.url,
      method: request.method,
      ...properties,
    },
  });
}

function captureError(error, request, distinctId) {
  if (!posthog) {
    return;
  }

  posthog.captureException(error, distinctId, {
    path: request?.routerPath || request?.url,
    method: request?.method,
  });
}

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
  try {
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

    const distinctId = getDistinctId(request, author);
    captureEvent(request, 'post_created', distinctId, {
      post_id: post.id,
      title_length: title.length,
      body_length: body.length,
      published: post.published,
    });

    return reply.status(201).send(post);
  } catch (error) {
    captureError(error, request, getDistinctId(request));
    throw error;
  }
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
  try {
    const post = posts.find((p) => p.id === parseInt(request.params.id, 10));

    if (!post) {
      return reply.status(404).send({ error: 'Post not found' });
    }

    const { title, body, published } = request.body || {};
    const wasPublished = post.published;

    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;
    if (published !== undefined) post.published = published;

    const distinctId = getDistinctId(request, post.author);
    captureEvent(request, 'post_updated', distinctId, {
      post_id: post.id,
      title_updated: title !== undefined,
      body_updated: body !== undefined,
      published: post.published,
    });

    if (!wasPublished && post.published) {
      captureEvent(request, 'post_published', distinctId, {
        post_id: post.id,
        comment_count: comments.filter((comment) => comment.post_id === post.id).length,
      });
    }

    return post;
  } catch (error) {
    captureError(error, request, getDistinctId(request));
    throw error;
  }
});

// Delete a post and its comments
fastify.delete('/api/posts/:id', async (request, reply) => {
  try {
    const index = posts.findIndex((p) => p.id === parseInt(request.params.id, 10));

    if (index === -1) {
      return reply.status(404).send({ error: 'Post not found' });
    }

    const deletedPost = posts[index];
    const postId = deletedPost.id;
    const deletedCommentCount = comments.filter((comment) => comment.post_id === postId).length;
    posts.splice(index, 1);

    // Remove associated comments
    for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].post_id === postId) comments.splice(i, 1);
    }

    captureEvent(request, 'post_deleted', getDistinctId(request, deletedPost.author), {
      post_id: postId,
      deleted_comment_count: deletedCommentCount,
      was_published: deletedPost.published,
    });

    return reply.status(204).send();
  } catch (error) {
    captureError(error, request, getDistinctId(request));
    throw error;
  }
});

// Add a comment to a post
fastify.post('/api/posts/:id/comments', async (request, reply) => {
  try {
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

    captureEvent(request, 'comment_created', getDistinctId(request, author), {
      post_id: post.id,
      comment_id: comment.id,
      comment_length: body.length,
      post_author_matches_comment_author: post.author === author,
    });

    return reply.status(201).send(comment);
  } catch (error) {
    captureError(error, request, getDistinctId(request));
    throw error;
  }
});

fastify.setErrorHandler((error, request, reply) => {
  captureError(error, request, getDistinctId(request));
  request.log.error(error);
  reply.status(error.statusCode || 500).send({ error: error.message || 'Internal Server Error' });
});

const shutdownPostHog = async () => {
  if (posthog) {
    await posthog.shutdown();
  }
};

process.on('SIGINT', async () => {
  await shutdownPostHog();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdownPostHog();
  process.exit(0);
});

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
