import { Router } from 'express';
import { listProducts } from '../lib/catalog.js';

type ReportConfig = {
  lowStockThreshold: number;
};

const storedConfig = '{"lowStockThreshold": 10,}';

export const reportsRouter = Router();

reportsRouter.get('/low-stock', (_req, res) => {
  const config = JSON.parse(storedConfig) as ReportConfig;
  const items = listProducts().filter(
    (p) => p.stock < config.lowStockThreshold,
  );
  res.json({ threshold: config.lowStockThreshold, items });
});
