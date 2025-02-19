import { Module } from "@nestjs/common";
import { ProductsController } from "./product.controller";
import { ProductsService } from "./services/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductImage } from "./entities/productImage.entity";
import { CategoriesModule } from "../categories/category.module";
import { ProductsApiService } from "./services/productApi.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductImage]),
        CategoriesModule
    ],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsApiService],
    exports: [ProductsApiService]
})
export class ProductsModule { }