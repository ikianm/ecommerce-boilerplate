import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoriesService } from "./services/category.service";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { AdminGuard } from "../common/guards/admin.guard";


@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(parseInt(id), updateCategoryDto);
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(parseInt(id));
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

}