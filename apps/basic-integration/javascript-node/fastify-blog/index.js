import { loadEnvFile } from 'node:process';
import Fastify from 'fastify';
import { PostHog } from 'posthog-node';

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;

if ((!posthogProjectToken || !posthogHost) && process.env.NODE_ENV !== 'production') {
  const missingVariable = !posthogProjectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = posthogProjectToken && posthogHost
  ? new PostHog(posthogProjectToken, {
    host: posthogHost,
    enableExceptionAutocapture: true,
  })
  : null;

const fastify = Fastify({ logger: true });

fastify.addHook('onClose', async () => {
  if (posthog) {
    await posthog.shutdown();
  }
});

fastify.setErrorHandler((error, request, reply) => {
  if (posthog) {
    posthog.captureException(error, undefined, {
      endpoint: request.routeOptions.url,
      method: request.method,
    });
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

  if (posthog) {
    posthog.capture({
      event: 'post_created',
      properties: {
        post_id: post.id,
        published: post.published,
      },
    });
  }

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

  if (posthog) {
    posthog.capture({
      event: 'post_updated',
      properties: {
        post_id: post.id,
        published: post.published,
        updated_fields: updatedFields,
      },
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

  const postId = posts[index].id;
  const deletedCommentCount = comments.filter((comment) => comment.post_id === postId).length;
  posts.splice(index, 1);

  // Remove associated comments
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].post_id === postId) comments.splice(i, 1);
  }

  if (posthog) {
    posthog.capture({
      event: 'post_deleted',
      properties: {
        post_id: postId,
        deleted_comment_count: deletedCommentCount,
      },
    });
  }

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

  if (posthog) {
    posthog.capture({
      event: 'comment_created',
      properties: {
        comment_id: comment.id,
        post_id: post.id,
      },
    });
  }

  return reply.status(201).send(comment);
});

const PORT = process.env.PORT || 3001;

const shutdown = async () => {
  await fastify.close();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

fastify.listen({ port: PORT }, async (err) => {
  if (err) {
    fastify.log.error(err);
    await fastify.close();
    process.exit(1);
  }
});
