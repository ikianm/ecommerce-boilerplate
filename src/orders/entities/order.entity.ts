import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { OrderStatus } from "../orderStatus.enum";
import { User } from "../../users/user.entity";
import { OrderItem } from "./orderItem.entity";


@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    totalPrice: number;

    @Column()
    shippingAddress: string;

    @Column({ enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @ManyToOne(() => User)
    user: User;

    @Column()
    userId: number;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    items: OrderItem[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Timestamp;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Timestamp;
}