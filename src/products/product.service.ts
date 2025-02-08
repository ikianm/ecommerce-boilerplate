import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { ProductImage } from "./entities/productImage.entity";


@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productsImageRepository: Repository<ProductImage>
    ) { }

    async create(createProductDto: CreateProductDto, images: Express.Multer.File[]): Promise<any> {
        const { name, description, price, stockQuantity } = createProductDto;

        const product = new Product();
        Object.assign(product, {
            name,
            description,
            price: parseInt(price),
            stockQuantity: parseInt(stockQuantity)
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


}

