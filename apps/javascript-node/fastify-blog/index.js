import Fastify from 'fastify';
import { PostHog } from 'posthog-node';

const fastify = Fastify({ logger: true });

const posts = [];
const comments = [];
let nextPostId = 1;
let nextCommentId = 1;

// --- PostHog Setup ---

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: process.env.POSTHOG_HOST,
});

// List posts (with optional author filter and pagination)
fastify.get('/api/posts', async (request) => {
  let result = posts;
  const { author, limit = 20, offset = 0 } = request.query;

  if (author) {
    result = result.filter((p) => p.author === author);
  }

  const userId = request.query.user_id || 'anonymous';
  posthog.capture({
    distinctId: userId,
    event: 'posts_listed',
    properties: {
      total_posts: result.length,
      author_filter: author || null,
    },
  });

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

  posthog.identify({
    distinctId: author,
    properties: {
      last_active: new Date().toISOString(),
    },
  });

  posthog.capture({
    distinctId: author,
    event: 'post_created',
    properties: {
      post_id: post.id,
      title_length: title.length,
      body_length: body.length,
    },
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

  const userId = request.query.user_id || 'anonymous';
  posthog.capture({
    distinctId: userId,
    event: 'post_viewed',
    properties: {
      post_id: post.id,
      post_author: post.author,
      comment_count: postComments.length,
    },
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

  const userId = request.body?.user_id || post.author;
  posthog.capture({
    distinctId: userId,
    event: 'post_updated',
    properties: {
      post_id: post.id,
      published: post.published,
    },
  });

  return post;
});

// Delete a post and its comments
fastify.delete('/api/posts/:id', async (request, reply) => {
  const index = posts.findIndex((p) => p.id === parseInt(request.params.id, 10));

  if (index === -1) {
    return reply.status(404).send({ error: 'Post not found' });
  }

  const postId = posts[index].id;
  const postAuthor = posts[index].author;
  posts.splice(index, 1);

  // Remove associated comments
  let removedComments = 0;
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].post_id === postId) {
      comments.splice(i, 1);
      removedComments++;
    }
  }

  const userId = request.query.user_id || postAuthor;
  posthog.capture({
    distinctId: userId,
    event: 'post_deleted',
    properties: {
      post_id: postId,
      comments_removed: removedComments,
    },
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

  posthog.capture({
    distinctId: author,
    event: 'comment_added',
    properties: {
      comment_id: comment.id,
      post_id: post.id,
      post_author: post.author,
    },
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

// Graceful shutdown, flush PostHog events before exiting
async function shutdown() {
  await fastify.close();
  await posthog.shutdown();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
