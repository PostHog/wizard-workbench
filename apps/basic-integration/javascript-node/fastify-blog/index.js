import Fastify from 'fastify';
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const fastify = Fastify({ logger: true });

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

  posthog.identify({ distinctId: author, properties: { name: author } });
  posthog.capture({
    distinctId: author,
    event: 'post_created',
    properties: { post_id: post.id, title: post.title },
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
    posthog.capture({
      distinctId: post.author,
      event: 'post_published',
      properties: { post_id: post.id, title: post.title },
    });
  } else if (title !== undefined || body !== undefined) {
    posthog.capture({
      distinctId: post.author,
      event: 'post_updated',
      properties: {
        post_id: post.id,
        title: post.title,
        fields_updated: [title !== undefined && 'title', body !== undefined && 'body'].filter(Boolean),
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

  const post = posts[index];
  posts.splice(index, 1);

  // Remove associated comments
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].post_id === post.id) comments.splice(i, 1);
  }

  posthog.capture({
    distinctId: post.author,
    event: 'post_deleted',
    properties: { post_id: post.id, title: post.title },
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

  posthog.identify({ distinctId: author, properties: { name: author } });
  posthog.capture({
    distinctId: author,
    event: 'comment_added',
    properties: { comment_id: comment.id, post_id: post.id, post_title: post.title },
  });

  return reply.status(201).send(comment);
});

fastify.setErrorHandler((err, request, reply) => {
  posthog.captureException(err);
  reply.send(err);
});

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});
