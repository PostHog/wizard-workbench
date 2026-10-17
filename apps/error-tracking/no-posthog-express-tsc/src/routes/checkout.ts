import { Router } from 'express';
import { findProduct } from '../lib/catalog.js';
import { badRequest, notFound } from '../lib/http-error.js';
import { reserveStock } from '../lib/inventory.js';

type CheckoutBody = {
  sku?: string;
  quantity?: number;
};

export const checkoutRouter = Router();

checkoutRouter.post('/', async (req, res) => {
  const { sku, quantity = 1 } = (req.body ?? {}) as CheckoutBody;
  if (!sku) {
    throw badRequest('sku is required');
  }

  const product = findProduct(sku);
  if (!product) {
    throw notFound(`Product ${sku} not found`);
  }

  const reservation = await reserveStock(product, quantity);

  res.status(201).json({
    reservation,
    totalCents: product.priceCents * quantity,
  });
});
