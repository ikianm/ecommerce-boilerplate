import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dtos/create-product.dto";
import { multerOptions } from "./multer/multerConfig";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ProductQueryDto } from "./dtos/product-query.dto";


@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('images', 8, multerOptions))
    create(@Body() createProductDto: CreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
        return this.productsService.create(createProductDto, images);
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(parseInt(id), updateProductDto);
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(parseInt(id));
    }

    @Get()
    findAll(@Query() productQueryDto: ProductQueryDto) {
        return this.productsService.findAll(productQueryDto);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.productsService.findById(parseInt(id));
    }

    @Get('byCategory/:category')
    findByCategory(@Param('category') category: string) {
        return this.productsService.findByCategory(category);
    }


}