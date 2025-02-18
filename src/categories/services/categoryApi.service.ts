import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../category.entity";
import { Repository } from "typeorm";


@Injectable()
export class CategoriesApiService {

    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>
    ) { }

    async findById(id: number): Promise<Category> {
        const category = await this.categoriesRepository.findOneBy({ id });
        if (!category) throw new BadRequestException(`no category found by id ${id}`);

        return category;
    }

}