import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { ProductModule } from 'src/product/product.module';
import { OrderItem } from './orderItem.entity';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { MailService } from './mail.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, EmailProcessor, MailService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  exports: [MailService],
})
export class OrderModule {}
