import { Injectable } from "@nestjs/common";
import { Cart } from "../entities/cart.entity";
import { QueryRunner, Repository } from "typeorm";
import { User } from "../../users/user.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class CartsApiService {

    constructor(
        @InjectRepository(Cart)
        private readonly cartsRepository: Repository<Cart>
    ) { }

    async create(user: User, queryRunner: QueryRunner): Promise<Cart> {
        const newCart = new Cart();
        newCart.user = user;
        return await queryRunner.manager.save(newCart);
    }

    async findByUserId(userId: number): Promise<Cart | null> {
        return await this.cartsRepository.findOne({
            where: { userId },
            relations: {
                items: {
                    product: true
                }
            }
        })
    }

}