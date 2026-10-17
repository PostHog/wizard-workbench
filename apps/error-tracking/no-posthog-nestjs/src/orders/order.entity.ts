export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'archived';

export type Order = {
  id: number;
  userId: number;
  totalCents: number;
  currency: string;
  status: OrderStatus;
};
