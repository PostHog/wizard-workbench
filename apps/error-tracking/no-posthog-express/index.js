const express = require('express');

const app = express();

app.get('/', (_req, res) => {
  res.json({ service: 'express', status: 'ok' });
});

app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
