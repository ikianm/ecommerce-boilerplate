import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../carts.entity";
import { QueryRunner, Repository } from "typeorm";
import { User } from "../../users/user.entity";


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

}