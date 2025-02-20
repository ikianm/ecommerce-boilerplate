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

    async increaseCartItemQuantity(userId: number, productId: number): Promise<Cart> {
        const usersCart = await this.findUsersCart(userId);

        const cartItemProduct = usersCart.items.find(cartItem => cartItem.productId === productId);
        if (!cartItemProduct) throw new BadRequestException('product is not in the cart');

        cartItemProduct.quantity += 1;
        usersCart.totalPrice += cartItemProduct.product.price;

        await this.cartsItemRepository.save(cartItemProduct);

        return await this.cartsRepository.save(usersCart);
    }

    async removeCartItem(userId: number, productId: number): Promise<Cart> {
        const usersCart = await this.findUsersCart(userId);

        const itemIndex = usersCart.items.findIndex(cartItem => cartItem.productId === productId);
        if (itemIndex === -1) throw new BadRequestException('product is not in the cart');

        const [removedItem] = usersCart.items.splice(itemIndex, 1);

        await this.cartsItemRepository.remove(removedItem);

        return usersCart;
    }

}