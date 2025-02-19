import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../carts.entity";
import { Repository } from "typeorm";
import { UsersApiService } from "../../users/services/userApi.service";


@Injectable()
export class CartsService {

    constructor(
        @InjectRepository(Cart)
        private readonly cartsRepository: Repository<Cart>
    ) { }

    async findUsersCart(userId: number) {
        const usersCart = await this.cartsRepository.findOneBy({ userId });
        if (!usersCart) throw new BadRequestException(`no cart found for user with id ${userId}`);
        return usersCart;
    }

}