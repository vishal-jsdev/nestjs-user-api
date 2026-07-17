import { Type } from 'class-transformer';
import { IsInt, Min, ValidateNested } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateProductDto {
  @IsInt()
  id!: number;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products?: CreateProductDto[];
}
