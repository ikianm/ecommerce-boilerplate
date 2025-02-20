import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { User } from "../../users/user.entity";
import { CartItem } from "./cartItem.entity";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column()
    userId: number;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    items: CartItem[];

    @Column({ default: 0 })
    totalPrice: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Timestamp;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Timestamp;

}