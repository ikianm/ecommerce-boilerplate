import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../common/enums/userRole.enum";
import { Cart } from "../carts/entities/cart.entity";
import { Exclude } from "class-transformer";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    address: string;

    @Column({ default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true, default: null })
    refreshToken: string;

    @OneToOne(() => Cart)
    cart: Cart;

}