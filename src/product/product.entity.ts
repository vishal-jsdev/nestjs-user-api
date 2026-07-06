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
  name!: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    nullable: false,
    unique: true,
  })
  SKU!: string;

  @Column({
    nullable: false,
  })
  salePrice!: number;

  @Column({
    nullable: true,
  })
  currencyCode?: string;

  @Column({
    nullable: true,
    default: 0,
  })
  quantity!: number;

  @Column({
    nullable: true,
  })
  category?: string;

  @Column({
    nullable: true,
  })
  tags?: string;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}
