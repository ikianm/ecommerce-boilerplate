import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { ProductImage } from "./entities/productImage.entity";
import { UpdateProductDto } from "./dtos/update-product.dto";


@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productsImageRepository: Repository<ProductImage>
    ) { }

    async findById(id: number): Promise<Product> {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) throw new BadRequestException(`no product found by id ${id}`);
        return product;
    }

    async create(createProductDto: CreateProductDto, images: Express.Multer.File[]): Promise<any> {
        const { name, description, price, stockQuantity } = createProductDto;

        const duplicateProductName = await this.productsRepository.existsBy({ name });
        if (duplicateProductName) throw new BadRequestException(`product with name ${name} already exists`);

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

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {

        if (updateProductDto.name) {
            const duplicateProductName = await this.productsRepository.existsBy({ name: updateProductDto.name });
            if (duplicateProductName) throw new BadRequestException(`product with name ${updateProductDto.name} already exists`);
        }

        const product = await this.findById(id);
        Object.assign(product, updateProductDto);
        return await this.productsRepository.save(product);
    }

    async remove(id: number): Promise<Product> {
        const product = await this.findById(id);
        return await this.productsRepository.remove(product);
    }


}

