import { Router } from 'express';
import { findProduct, listProducts } from '../lib/catalog.js';
import { notFound } from '../lib/http-error.js';

export const productsRouter = Router();

productsRouter.get('/', (_req, res) => {
  res.json({ products: listProducts() });
});

productsRouter.get('/:sku', (req, res) => {
  const product = findProduct(req.params.sku);
  if (!product) {
    throw notFound(`Product ${req.params.sku} not found`);
  }
  res.json(product);
});
