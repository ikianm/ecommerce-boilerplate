import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Product } from "../products/entities/product.entity";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column()
    userId: number;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];

    @Column({ default: 0 })
    totalPrice: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Timestamp;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Timestamp;

}