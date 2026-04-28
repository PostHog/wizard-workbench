const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ quack: 'quack' });
});

app.listen(PORT, () => {
  console.log(`quack-quack running on http://localhost:${PORT}`);
});
