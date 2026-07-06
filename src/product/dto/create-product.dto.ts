import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  SKU?: string;

  @IsNumber()
  @Min(1)
  salePrice!: number;

  @IsOptional()
  @IsString()
  @Length(3)
  currencyCode?: string;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}
