import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoriesController } from "./category.controller";
import { CategoriesService } from "./category.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([Category])
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService]
})
export class CategoriesModule { }