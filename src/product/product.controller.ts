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
import { Param } from '@nestjs/common/decorators';

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
  async getAllProduct(@Query() pageQueryDto: PageQueryDto) {
    const paginationResponse =
      await this.productService.getAllProduct(pageQueryDto);

    return plainToInstance(PaginationResponseDto, paginationResponse);
  }
}
