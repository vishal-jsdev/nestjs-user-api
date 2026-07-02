import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItem } from './order.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/product.entity';

interface JwtPayload {
  sub: number;
  email: string;
}
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    private readonly productService: ProductService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: JwtPayload) {
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

    const order = this.ordersRepository.create({
      items: orderItems,
      products,
      user: { id: user.sub },
    });
    const savedOrder = await this.ordersRepository.save(order);
    await this.productService.updateStock(productsMap);
    return savedOrder;
  }
}
