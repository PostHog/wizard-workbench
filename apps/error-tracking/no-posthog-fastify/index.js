import Fastify from 'fastify';

const app = Fastify();

app.get('/', async () => ({ service: 'fastify', status: 'ok' }));

await app.listen({ port: 3000 });
console.log('listening on http://localhost:3000');
