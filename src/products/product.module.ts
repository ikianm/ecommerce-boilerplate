import { Module } from "@nestjs/common";
import { ProductsController } from "./product.controller";
import { ProductsService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductImage } from "./entities/productImage.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductImage])
    ],
    controllers: [ProductsController],
    providers: [ProductsService]
})
export class ProductsModule { }