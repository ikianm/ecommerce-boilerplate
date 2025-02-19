import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './services/carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/carts.entity';
import { CartsApiService } from './services/cartsApi.service';
import { ProductsModule } from '../products/product.module';
import { CartItem } from './entities/cartItem.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, CartItem]),
        ProductsModule
    ],
    controllers: [CartsController],
    providers: [CartsService, CartsApiService],
    exports: [CartsApiService]
})
export class CartsModule { }
