import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/product.entity';
import { OrderItem } from './orderItem.entity';
import type { JwtPayload } from 'src/interfaces/interface';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    private readonly productService: ProductService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    private dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: JwtPayload) {
    // 1. Create a new query runner
    const queryRunner = this.dataSource.createQueryRunner();

    // 2. Connect and start the transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const productsData: Product[] = await this.productService.getProducts(
        createOrderDto.items.map((item) => item.productId),
      );
      const productsMap: Record<number, Product> = productsData.reduce(
        (map, product) => {
          map[product.id] = product;
          return map;
        },
        {},
      );
      const orderItems = createOrderDto.items.map((item) => {
        const product: Product = productsMap[item.productId];
        if (item.quantity > product.quantity) {
          throw new BadRequestException(
            `Stock is less than given order with product ${product.name}`,
          );
        }

        product.quantity = product.quantity - item.quantity;
        const orderItem = new OrderItem();

        orderItem.productId = item.productId;
        orderItem.quantity = item.quantity;
        orderItem.price = product.salePrice; // Fetch real price from ProductService
        return orderItem;
      });

      const products = createOrderDto.items.map((item) => {
        return { id: item.productId };
      });

      const order = queryRunner.manager.create(Order, {
        items: orderItems,
        products,
        user: { id: user.sub },
      });
      const savedOrder = await queryRunner.manager.save(order);
      await this.productService.updateStock(productsMap, queryRunner);
      await queryRunner.commitTransaction();
      await this.emailQueue.add('send-confirmation-email', {
        id: savedOrder.id,
        email: user.email,
        items: savedOrder.items,
      });
      return savedOrder;
    } catch (error) {
      // 5. Rollback updates if any operation fails
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 6. Release the query runner to pool connection
      await queryRunner.release();
    }
  }
}
