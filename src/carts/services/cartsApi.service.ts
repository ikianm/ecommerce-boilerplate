import { Injectable } from "@nestjs/common";
import { Cart } from "../entities/carts.entity";
import { QueryRunner } from "typeorm";
import { User } from "../../users/user.entity";


@Injectable()
export class CartsApiService {

    async create(user: User, queryRunner: QueryRunner): Promise<Cart> {
        const newCart = new Cart();
        newCart.user = user;
        return await queryRunner.manager.save(newCart);
    }

}