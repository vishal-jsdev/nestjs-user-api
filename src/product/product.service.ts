import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageQueryDto } from './dto/page-query.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const productExist = await this.productRepository.findOneBy({
      name: createProductDto.name,
    });
    if (productExist) {
      throw new BadRequestException('Product is already existed!');
    }
    const product = this.productRepository.create(createProductDto);
    const productData = await this.productRepository.save(product);
    return productData;
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({
      id: updateProductDto.id,
    });
    if (!product) {
      throw new BadRequestException('Product is not found!');
    }
    const saveData = {
      ...product,
      ...updateProductDto,
    };
    const productData = await this.productRepository.save(saveData);
    return productData;
  }

  async getAllProduct(pageQueryDto: PageQueryDto) {
    const skip = (pageQueryDto.page - 1) * pageQueryDto.limit;
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Attach filters, joins, or sorting conditions safely here
    queryBuilder
      .orderBy('product.id', 'ASC')
      .skip(skip)
      .take(pageQueryDto.limit);
    const [products, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      totalPages: Math.ceil(totalCount / pageQueryDto.limit),
      totalItems: totalCount,
    };
  }

  async getProducts(products: number[]) {
    const productsData = await this.productRepository.find({
      where: { id: In(products) },
    });

    return productsData;
  }

  async updateStock(productsMap: Record<number, Product>) {
    for (const value of Object.values(productsMap)) {
      await this.productRepository.save(value);
    }
  }
}
