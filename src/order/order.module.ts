import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { ProductModule } from 'src/product/product.module';
import { OrderItem } from './orderItem.entity';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductModule,
    BullModule.registerQueue({
      name: 'email',
    }),
    EmailModule,
  ],
})
export class OrderModule {}
