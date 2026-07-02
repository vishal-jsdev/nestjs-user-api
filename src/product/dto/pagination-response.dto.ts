import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from './product-response.dto';

export class PaginationResponseDto {
  @Expose()
  @Type(() => ProductResponseDto)
  data: ProductResponseDto[];
  @Expose()
  totalPages: number;
  @Expose()
  totalItems: number;
}
