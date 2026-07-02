import { Order } from 'src/order/order.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  SKU: string;

  @Column({
    nullable: true,
  })
  salePrice: number;

  @Column({
    nullable: true,
  })
  currencyCode: string;

  @Column({
    nullable: true,
  })
  quantity: number;

  @Column({
    nullable: true,
  })
  category: string;

  @Column({
    nullable: true,
  })
  tags: string;

  @ManyToMany(() => Order, (order) => order.products, { onDelete: 'CASCADE' })
  orders: Order[];
}
