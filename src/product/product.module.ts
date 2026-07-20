import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CacheService } from './cache.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, CacheService],
  imports: [TypeOrmModule.forFeature([Product])],
  exports: [ProductService],
})
export class ProductModule {}
