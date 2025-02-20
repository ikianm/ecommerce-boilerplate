import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../entities/carts.entity";
import { Repository } from "typeorm";
import { ProductsApiService } from "../../products/services/productApi.service";
import { CartItem } from "../entities/cartItem.entity";


@Injectable()
export class CartsService {

    constructor(
        @InjectRepository(Cart)
        private readonly cartsRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartsItemRepository: Repository<CartItem>,
        private readonly productsApiService: ProductsApiService
    ) { }

    //FIXME - fix this since it broke after changing carts
    async findUsersCart(userId: number): Promise<Cart> {
        const usersCart = await this.cartsRepository.findOne({
            where: { userId },
            relations: {
                items: {
                    product: true
                }
            }
        });
        if (!usersCart) throw new BadRequestException(`no cart found for user with id ${userId}`);
        return usersCart;
    }

    //TODO - if product is in card already, increase quantity, else add product to card
    async addToCart(userId: number, productId: number): Promise<Cart> {
        const [usersCart, product] = await Promise.all([
            this.findUsersCart(userId),
            this.productsApiService.findById(productId)
        ]);

        if (!product) throw new BadRequestException(`no product found by id ${productId}`);
        if (product.stockQuantity < 1) throw new ConflictException('product is out of stock');

        const productInCart = usersCart.items.find(cartItem => cartItem.productId === productId);

        if (productInCart) { // product already in cart
            productInCart.quantity += 1;
            await this.cartsItemRepository.save(productInCart);
        } else {
            const newCartItem = new CartItem();
            newCartItem.product = product;
            newCartItem.quantity = 1;
            await this.cartsItemRepository.save(newCartItem);
            usersCart.items.push(newCartItem);
        }

        usersCart.totalPrice += product.price;

        return await this.cartsRepository.save(usersCart);
    }

}