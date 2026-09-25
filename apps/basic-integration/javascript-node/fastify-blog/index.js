import 'dotenv/config';
import Fastify from 'fastify';
import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { PostHog } from 'posthog-node';

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;

if (!posthogProjectToken && process.env.NODE_ENV !== 'production') {
  throw new Error('POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured');
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  throw new Error('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
}

const posthog = posthogProjectToken && posthogHost
  ? new PostHog(posthogProjectToken, { host: posthogHost, enableExceptionAutocapture: true })
  : null;

const posthogLogsSdk = posthogProjectToken && posthogHost
  ? new NodeSDK({
    resource: resourceFromAttributes({ 'service.name': 'fastify-blog' }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(new OTLPLogExporter({
        url: new URL('/i/v1/logs', posthogHost).toString(),
        headers: { Authorization: `Bearer ${posthogProjectToken}` },
      })),
    ],
  })
  : null;

posthogLogsSdk?.start();
const posthogLog = logs.getLogger('posthog-fastify-blog');

const fastify = Fastify({ logger: true });

fastify.addHook('onClose', async () => {
  await posthogLogsSdk?.shutdown();
  await posthog?.shutdown();
});

fastify.setErrorHandler((error, request, reply) => {
  const requestDistinctId = request.headers['x-posthog-distinct-id'];
  const distinctId = (Array.isArray(requestDistinctId) ? requestDistinctId[0] : requestDistinctId) || request.id;

  if (posthog) {
    posthog.captureException(error, distinctId);
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
      properties: { post_id: post.id, published: post.published },
    });
  }

  if (posthogLogsSdk) {
    posthogLog.emit({
      severityText: 'INFO',
      body: 'post created',
      attributes: { event: 'post_created', post_id: post.id, published: post.published },
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
  if (title !== undefined) post.title = title;
  if (body !== undefined) post.body = body;
  if (published !== undefined) post.published = published;

  const updatedFields = [
    ...(title !== undefined ? ['title'] : []),
    ...(body !== undefined ? ['body'] : []),
    ...(published !== undefined ? ['published'] : []),
  ];

  if (posthog) {
    posthog.capture({
      event: 'post_updated',
      properties: {
        post_id: post.id,
        updated_fields: updatedFields,
        published: post.published,
      },
    });
  }

  if (posthogLogsSdk) {
    posthogLog.emit({
      severityText: 'INFO',
      body: 'post updated',
      attributes: { event: 'post_updated', post_id: post.id, updated_fields: updatedFields.join(','), published: post.published },
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
      properties: { post_id: postId, deleted_comment_count: deletedCommentCount },
    });
  }

  if (posthogLogsSdk) {
    posthogLog.emit({
      severityText: 'INFO',
      body: 'post deleted',
      attributes: { event: 'post_deleted', post_id: postId, deleted_comment_count: deletedCommentCount },
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
      properties: { comment_id: comment.id, post_id: comment.post_id },
    });
  }

  if (posthogLogsSdk) {
    posthogLog.emit({
      severityText: 'INFO',
      body: 'comment created',
      attributes: { event: 'comment_created', comment_id: comment.id, post_id: comment.post_id },
    });
  }

  return reply.status(201).send(comment);
});

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
