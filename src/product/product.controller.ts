import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { plainToInstance } from 'class-transformer';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageQueryDto } from './constant/page-query.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Param, UseInterceptors } from '@nestjs/common/decorators';

@UseInterceptors(CacheInterceptor)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.createProduct(createProductDto);
    return plainToInstance(ProductResponseDto, product);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.updateProduct(
      id,
      updateProductDto,
    );
    return plainToInstance(ProductResponseDto, product);
  }

  @Get()
  @CacheKey('custom_key1') // Controlling the key
  @CacheTTL(120000) // Controling the duration
  async getAllProduct(@Query() pageQueryDto: PageQueryDto) {
    const paginationResponse =
      await this.productService.getAllProduct(pageQueryDto);

    return plainToInstance(PaginationResponseDto, paginationResponse);
  }
}
