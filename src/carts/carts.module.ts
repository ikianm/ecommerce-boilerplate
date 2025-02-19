import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './services/carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './carts.entity';
import { CartsApiService } from './services/cartsApi.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart])
    ],
    controllers: [CartsController],
    providers: [CartsService, CartsApiService],
    exports: [CartsApiService]
})
export class CartsModule { }
