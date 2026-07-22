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
import { CacheService } from './cache.service';
import { PRODUCT } from './constant/product.constant';

@UseInterceptors(CacheInterceptor)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.createProduct(createProductDto);
    await this.cacheService.deleteKey(PRODUCT);
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
    await this.cacheService.deleteKey(PRODUCT);
    return plainToInstance(ProductResponseDto, product);
  }

  @Get()
  @CacheKey(PRODUCT) // Controlling the key
  @CacheTTL(120000) // Controling the duration
  async getAllProduct(@Query() pageQueryDto: PageQueryDto) {
    const paginationResponse =
      await this.productService.getAllProduct(pageQueryDto);

    return plainToInstance(PaginationResponseDto, paginationResponse);
  }
}
