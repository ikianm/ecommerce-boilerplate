import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dtos/create-product.dto";
import { multerOptions } from "./multer/multerConfig";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { AdminGuard } from "../common/guards/admin.guard";


@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('images', 8, multerOptions))
    create(@Body() createProductDto: CreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
        return this.productsService.create(createProductDto, images);
    }

}