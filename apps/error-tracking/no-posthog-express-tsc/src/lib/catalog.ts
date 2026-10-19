export type Product = {
  sku: string;
  name: string;
  priceCents: number;
  stock: number;
};

const products: Product[] = [
  { sku: 'MUG-001', name: 'Enamel mug', priceCents: 1800, stock: 42 },
  { sku: 'TEE-014', name: 'Organic tee', priceCents: 3200, stock: 0 },
  { sku: 'CAP-007', name: 'Five-panel cap', priceCents: 2600, stock: 9 },
];

export function listProducts(): Product[] {
  return products;
}

export function findProduct(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku.toUpperCase());
}
