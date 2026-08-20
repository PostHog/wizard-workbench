export interface Product {
  slug: string
  name: string
  priceUsd: number
}

export const PRODUCTS: Product[] = [
  { slug: 'speckled-mug', name: 'Speckled mug', priceUsd: 28 },
  { slug: 'serving-bowl', name: 'Serving bowl', priceUsd: 54 },
  { slug: 'bud-vase', name: 'Bud vase', priceUsd: 36 },
]
