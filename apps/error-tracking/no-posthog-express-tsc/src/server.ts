import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { HttpError } from './lib/http-error.js';
import { checkoutRouter } from './routes/checkout.js';
import { healthRouter } from './routes/health.js';
import { productsRouter } from './routes/products.js';
import { reportsRouter } from './routes/reports.js';

const app = express();

app.disable('x-powered-by');
app.use(express.json());

app.use((req, res, next) => {
  const started = performance.now();
  res.on('finish', () => {
    const ms = (performance.now() - started).toFixed(1);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

app.use('/health', healthRouter);
app.use('/products', productsRouter);
app.use('/checkout', checkoutRouter);
app.use('/reports', reportsRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = err instanceof HttpError ? err.status : 500;
  if (status >= 500) {
    console.error(`Unhandled error on ${req.method} ${req.originalUrl}`, err);
  }

  const message =
    err instanceof HttpError && err.expose
      ? err.message
      : 'Internal Server Error';
  res.status(status).json({ error: message });
});

const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
