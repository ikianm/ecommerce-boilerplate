import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoriesController } from "./category.controller";
import { CategoriesService } from "./services/category.service";
import { CategoriesApiService } from "./services/categoryApi.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([Category])
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService, CategoriesApiService],
    exports: [CategoriesApiService]
})
export class CategoriesModule { }