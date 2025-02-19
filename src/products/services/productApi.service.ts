import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { Repository } from "typeorm";


@Injectable()
export class ProductsApiService {

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) { }

    async findById(id: number): Promise<Product | null> {
        return await this.productsRepository.findOneBy({ id });
    }

}