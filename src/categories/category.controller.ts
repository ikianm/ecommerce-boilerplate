import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoriesService } from "./category.service";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { AdminGuard } from "../common/guards/admin.guard";


@UseGuards(AccessTokenGuard, AdminGuard)
@Controller('category')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(parseInt(id), updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(parseInt(id));
    }

}