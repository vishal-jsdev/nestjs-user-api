import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description: string;

  @Expose()
  SKU: string;

  @Expose()
  salePrice: number;

  @Expose()
  currencyCode: string;

  @Expose()
  quantity: number;

  @Expose()
  category: string;

  @Expose()
  tags: string;
}
