import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageQueryDto } from './constant/page-query.dto';

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
      throw new ConflictException('Product is already existed!');
    }
    createProductDto.SKU = createProductDto.name.toUpperCase();
    const product = this.productRepository.create(createProductDto);
    const productData = await this.productRepository.save(product);
    return productData;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new NotFoundException('Product is not found!');
    }
    if (updateProductDto.SKU && updateProductDto.SKU !== product.SKU) {
      const SKUExisting = await this.productRepository.findOneBy({
        SKU: updateProductDto.SKU,
      });
      if (SKUExisting && SKUExisting.id !== id) {
        throw new ConflictException('SKU name is already existed');
      }
    }
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const nameExisting = await this.productRepository.findOneBy({
        name: updateProductDto.name,
      });
      if (nameExisting && nameExisting.id !== id) {
        throw new ConflictException('Name is already existed');
      }
    }

    const saveData = {
      ...product,
      ...updateProductDto,
    };
    const productData = await this.productRepository.save(saveData);
    return productData;
  }

  async getAllProduct(pageQueryDto: PageQueryDto) {
    const skip = ((pageQueryDto.page ?? 1) - 1) * (pageQueryDto.limit ?? 10);
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Attach filters, joins, or sorting conditions safely here
    queryBuilder
      .orderBy('product.id', 'ASC')
      .skip(skip)
      .take(pageQueryDto.limit);
    const [products, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      totalPages: Math.ceil(totalCount / (pageQueryDto.limit ?? 10)),
      totalItems: totalCount,
      page: pageQueryDto.page,
      limit: pageQueryDto.limit,
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
