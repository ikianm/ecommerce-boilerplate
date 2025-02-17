import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProductImage } from "./productImage.entity";
import { Category } from "../../categories/category.entity";


@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stockQuantity: number;

    @ManyToOne(() => Category)
    category: Category;

    @OneToMany(() => ProductImage, (productImage) => productImage.product)
    images: ProductImage[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Timestamp;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Timestamp;

}