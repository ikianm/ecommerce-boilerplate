import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./carts.entity";
import { Product } from "../../products/entities/product.entity";


@Entity()
export class CartItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @ManyToOne(() => Product)
    product: Product;

    @Column({ default: 1 })
    quantity: number;

}