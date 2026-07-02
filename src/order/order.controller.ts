import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { plainToInstance } from 'class-transformer';
import { OrderResponseDto } from './dto/order-response.dto';
import { CurrentUser } from './decorator/user.decorator';
interface JwtPayload {
  sub: number;
  email: string;
}
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const order = await this.orderService.createOrder(createOrderDto, user);
    return plainToInstance(OrderResponseDto, order);
  }
}
