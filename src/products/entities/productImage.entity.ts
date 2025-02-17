import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    product: Product;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Timestamp;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Timestamp;

}