import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../carts.entity";
import { Repository } from "typeorm";
import { ProductsApiService } from "../../products/services/productApi.service";


@Injectable()
export class CartsService {

    constructor(
        @InjectRepository(Cart)
        private readonly cartsRepository: Repository<Cart>,
        private readonly productsApiService: ProductsApiService
    ) { }

    async findUsersCart(userId: number): Promise<Cart> {
        const usersCart = await this.cartsRepository.findOne({
            where: { userId },
            relations: {
                products: true
            }
        });
        if (!usersCart) throw new BadRequestException(`no cart found for user with id ${userId}`);
        return usersCart;
    }

    //TODO - if product is in card already, increase quantity, else add product to card
    async addToCart(userId: number, productId: number): Promise<Cart> {
        const usersCart = await this.findUsersCart(userId);
        const product = await this.productsApiService.findById(productId);
        if (!product) throw new BadRequestException(`no product found by id ${productId}`);
        if (product.stockQuantity < 1) throw new BadRequestException(`${product.name} is out of stock`);

        usersCart.products.push(product);
        usersCart.totalPrice += product.price;

        return await this.cartsRepository.save(usersCart);
    }

}