import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import type { Order } from './order.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  private readonly orders: Order[] = [
    { id: 101, userId: 1, totalCents: 4900, currency: 'USD', status: 'paid' },
    {
      id: 102,
      userId: 2,
      totalCents: 1500,
      currency: 'USD',
      status: 'pending',
    },
    {
      id: 103,
      userId: 1,
      totalCents: 9900,
      currency: 'EUR',
      status: 'archived',
    },
  ];

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  findAll(): Order[] {
    return this.orders.filter((o) => o.status !== 'archived');
  }

  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new HttpException(`Order ${id} not found`, HttpStatus.NOT_FOUND);
    }
    if (order.status === 'archived') {
      throw new HttpException(`Order ${id} has been archived`, HttpStatus.GONE);
    }
    return order;
  }

  async charge(id: number): Promise<Order> {
    const order = this.findOne(id);
    const user = this.usersService.findOne(order.userId);
    const gateway = this.config.get<string>(
      'PAYMENTS_GATEWAY_URL',
      'https://payments.internal.example.com',
    );

    this.logger.log(
      `Charging order ${order.id} for ${user.email} via ${gateway}`,
    );
    await new Promise((resolve) => setTimeout(resolve, 25));

    if (order.status !== 'pending') {
      throw new Error(
        `Payment gateway rejected charge for order ${order.id}: status is ${order.status}`,
      );
    }

    order.status = 'paid';
    return order;
  }

  summarize(currency: string): { currency: string; totalCents: number } {
    const rates = this.loadRates();
    const totalCents = this.findAll().reduce((sum, order) => {
      const rate = rates[currency][order.currency];
      return sum + Math.round(order.totalCents * rate);
    }, 0);
    return { currency, totalCents };
  }

  // Keyed by target currency, then source currency.
  private loadRates(): Record<string, Record<string, number>> {
    return {
      USD: { USD: 1, EUR: 1.09 },
      EUR: { USD: 0.92, EUR: 1 },
    };
  }
}
