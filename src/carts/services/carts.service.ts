import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../entities/carts.entity";
import { DataSource, Repository } from "typeorm";
import { ProductsApiService } from "../../products/services/productApi.service";
import { CartItem } from "../entities/cartItem.entity";


@Injectable()
export class CartsService {

    constructor(
        @InjectRepository(Cart)
        private readonly cartsRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartsItemRepository: Repository<CartItem>,
        private readonly productsApiService: ProductsApiService,
        private readonly dataSource: DataSource
    ) { }

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

        const itemInCart = usersCart.items.find(cartItem => cartItem.productId === productId);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (itemInCart) { // product already in cart
                itemInCart.quantity += 1;
                await queryRunner.manager.save(itemInCart)
            } else {
                const newCartItem = new CartItem();
                newCartItem.product = product;
                newCartItem.quantity = 1;
                await queryRunner.manager.save(newCartItem);
                usersCart.items.push(newCartItem);
            }
            usersCart.totalPrice += product.price;
            const updatedUsersCart = await queryRunner.manager.save(usersCart);
            return updatedUsersCart;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }


    }

    async increaseCartItemQuantity(userId: number, productId: number): Promise<Cart> {
        const usersCart = await this.findUsersCart(userId);

        const cartItemProduct = usersCart.items.find(cartItem => cartItem.productId === productId);
        if (!cartItemProduct) throw new BadRequestException('product is not in the cart');

        cartItemProduct.quantity += 1;
        usersCart.totalPrice += cartItemProduct.product.price;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(cartItemProduct);
            const updatedUsersCart = await queryRunner.manager.save(usersCart);
            return updatedUsersCart;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }


    }

    async removeCartItem(userId: number, productId: number): Promise<Cart> {
        const usersCart = await this.findUsersCart(userId);

        const cartItemToRemove = usersCart.items.find(cartItem => cartItem.productId === productId);
        if (!cartItemToRemove) throw new BadRequestException('product is not in the cart');

        usersCart.totalPrice -= cartItemToRemove.quantity * cartItemToRemove.product.price;
        usersCart.items = usersCart.items.filter(cartItem => cartItem.productId !== productId);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.dataSource.manager.remove(cartItemToRemove);
            const updatedCart = await this.dataSource.manager.save(usersCart);
            await queryRunner.commitTransaction();
            return updatedCart;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }

    }

}