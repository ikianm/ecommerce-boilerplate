import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../common/enums/userRole.enum";
import { Cart } from "../carts/carts.entity";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true, default: null })
    refreshToken: string;

    @OneToOne(() => Cart)
    cart: Cart;

}