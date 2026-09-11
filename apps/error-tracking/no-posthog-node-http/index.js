import { createServer } from 'node:http';

const server = createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ service: 'node-http', status: 'ok' }));
});

server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
