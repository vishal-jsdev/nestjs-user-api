import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  SKU: string;

  @IsOptional()
  @IsInt()
  salePrice: number;

  @IsOptional()
  @IsString()
  @Length(3)
  currencyCode: string;

  @IsOptional()
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  tags: string;
}
