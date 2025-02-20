import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./carts.entity";
import { Product } from "../../products/entities/product.entity";


@Entity()
export class CartItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;

    @Column()
    cartId: number;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    productId: number;

    @Column({ default: 1 })
    quantity: number;

}