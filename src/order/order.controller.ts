import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { plainToInstance } from 'class-transformer';
import { OrderResponseDto } from './dto/order-response.dto';
import { CurrentUser } from './decorator/user.decorator';
import type { JwtPayload } from 'src/interfaces/interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const order = await this.orderService.createOrder(createOrderDto, user);
    await this.emailQueue.add('transcode-job', {
      id: order.id,
      email: user.email,
      items: order.items,
    });

    return plainToInstance(OrderResponseDto, order);
  }
}
