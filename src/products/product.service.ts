import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { ProductImage } from "./entities/productImage.entity";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { CategoriesApiService } from "../categories/services/categoryApi.service";


@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productsImageRepository: Repository<ProductImage>,
        private readonly categoriesApiService: CategoriesApiService
    ) { }

    async findById(id: number): Promise<Product> {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) throw new BadRequestException(`no product found by id ${id}`);
        return product;
    }

    async create(createProductDto: CreateProductDto, images: Express.Multer.File[]): Promise<any> {
        const { name, description, price, stockQuantity, categoryId } = createProductDto;

        const duplicateProductName = await this.productsRepository.existsBy({ name });
        if (duplicateProductName) throw new BadRequestException(`product with name ${name} already exists`);

        const category = await this.categoriesApiService.findById(parseInt(categoryId));

        const product = new Product();
        Object.assign(product, {
            name,
            description,
            price: parseInt(price),
            stockQuantity: parseInt(stockQuantity),
            category
        });

        const savedProduct = await this.productsRepository.save(product);

        await Promise.all(
            images.map(async (image) => {
                const productImage = new ProductImage();
                Object.assign(productImage, {
                    path: image.path,
                    product: savedProduct
                });
                await this.productsImageRepository.save(productImage);
            })
        );

        const productWithImages = await this.productsRepository.findOne({
            where: {
                id: savedProduct.id
            },
            relations: {
                images: true
            }
        });

        return productWithImages;
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const { name, price, description, stockQuantity, categoryId } = updateProductDto;

        const product = await this.findById(id);

        if (name) {
            const duplicateProductName = await this.productsRepository.existsBy({ name });
            if (duplicateProductName) throw new BadRequestException(`product with name ${name} already exists`);

            product.name = name;
        }

        if (categoryId) {
            const category = await this.categoriesApiService.findById(parseInt(categoryId));
            product.category = category;
        }

        product.price = price ? parseInt(price) : product.price;
        product.stockQuantity = stockQuantity ? parseInt(stockQuantity) : product.stockQuantity;
        product.description = description ? description : product.description;

        return await this.productsRepository.save(product);
    }

    async remove(id: number): Promise<Product> {
        const product = await this.findById(id);
        return await this.productsRepository.remove(product);
    }


}

