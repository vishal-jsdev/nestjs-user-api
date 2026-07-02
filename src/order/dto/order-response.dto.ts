import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from 'src/product/dto/product-response.dto';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';

export class OrderItemResponseDto {
  @Expose()
  id: number;
  @Expose()
  productId: number;
  @Expose()
  quantity: number;
  @Expose()
  price: number;
}

export class OrderResponseDto {
  @Expose()
  id: number;
  @Expose()
  createdAt: Date;
  @Expose()
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  products: ProductResponseDto[];
}
