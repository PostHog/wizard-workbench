export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 15
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 249.99,
    description: "Advanced fitness tracker with heart rate monitor and GPS.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 8
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: 59.99,
    description: "Durable backpack with padded laptop compartment and USB charging port.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "Accessories",
    stock: 25
  },
  {
    id: 4,
    name: "Coffee Maker",
    price: 89.99,
    description: "Programmable coffee maker with thermal carafe and auto-shutoff.",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
    category: "Home",
    stock: 12
  },
  {
    id: 5,
    name: "Yoga Mat",
    price: 29.99,
    description: "Non-slip eco-friendly yoga mat with carrying strap.",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    category: "Sports",
    stock: 30
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79.99,
    description: "Portable waterproof speaker with 12-hour battery life.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 18
  },
  {
    id: 7,
    name: "Running Shoes",
    price: 129.99,
    description: "Lightweight running shoes with responsive cushioning.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Sports",
    stock: 20
  },
  {
    id: 8,
    name: "Desk Lamp",
    price: 39.99,
    description: "LED desk lamp with adjustable brightness and color temperature.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    category: "Home",
    stock: 22
  }
];

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map(p => p.category)));
}
