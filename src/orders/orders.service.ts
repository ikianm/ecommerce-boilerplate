import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CartsApiService } from '../carts/services/cartsApi.service';
import { UsersApiService } from '../users/services/userApi.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderItem } from './entities/orderItem.entity';
import { ProductsApiService } from '../products/services/productApi.service';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
        private readonly cartsApiService: CartsApiService,
        private readonly usersApiService: UsersApiService,
        private readonly productsApiService: ProductsApiService,
        private readonly dataSource: DataSource
    ) { }

    async findUserOrders(userId: number): Promise<Order[]> {
        return await this.ordersRepository.find({
            where: {
                userId
            },
            relations: {
                items: {
                    product: true
                }
            }
        });
    }

    async findOne(id: number, userId: number): Promise<Order> {
        const order = await this.ordersRepository.findOne({
            where: {
                id
            },
            relations: {
                items: {
                    product: true
                }
            }
        });
        if (!order) throw new BadRequestException(`no order found with id ${id}`);
        if (order.userId !== userId) throw new ForbiddenException('order does not belong to user');

        return order;
    }

    async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
        const user = await this.usersApiService.findById(userId);
        if (!user) throw new BadRequestException(`no user found with id ${userId}`);
        if (!user.address && !createOrderDto) throw new BadRequestException('shipping address is not provided');

        const usersCart = await this.cartsApiService.findByUserId(userId);
        if (!usersCart) throw new BadRequestException('no cart found for user');
        if (usersCart.items.length < 1) throw new BadRequestException("user's cart is empty");

        const order = new Order();
        order.user = user;
        order.shippingAddress = createOrderDto.address ? createOrderDto.address : user.address;
        order.totalPrice = 0;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            const savedOrderItems = await Promise.all(usersCart.items.map(async (item) => {
                const product = await this.productsApiService.findById(item.productId);
                if (!product) throw new BadRequestException(`no product found with id ${item.productId}`);
                if (product.stockQuantity < 1) throw new ConflictException(`Product with id ${product!.id} is out of stock`);

                const orderItem = new OrderItem();
                orderItem.product = item.product;
                orderItem.quantity = item.quantity;
                order.totalPrice += orderItem.quantity * orderItem.product.price;
                return await queryRunner.manager.save(orderItem);
            }));

            order.items = savedOrderItems;
            await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
            return {
                ...order,
                items: [...savedOrderItems]
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }


    }

}
