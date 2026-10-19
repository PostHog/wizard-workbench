import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import type { Order } from './order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Order[] {
    return this.ordersService.findAll();
  }

  @Get('summary')
  summary(@Query('currency') currency = 'USD') {
    return this.ordersService.summarize(currency.toUpperCase());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Order {
    return this.ordersService.findOne(id);
  }

  @Post(':id/charge')
  @HttpCode(200)
  charge(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.charge(id);
  }
}
