import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = { service: 'koa', status: 'ok' };
});

app.use(router.routes());
app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
