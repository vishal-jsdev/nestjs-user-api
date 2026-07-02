import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from './order.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductModule],
})
export class OrderModule {}
