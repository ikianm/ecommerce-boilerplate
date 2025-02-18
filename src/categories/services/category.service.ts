import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { UpdateCategoryDto } from "../dtos/update-category.dto";


@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>
    ) { }

    async findById(id: number): Promise<Category> {
        const category = await this.categoriesRepository.findOneBy({ id });
        if (!category) throw new BadRequestException(`no category found by id ${id}`);
        return category;
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const duplicateNameCategory = await this.categoriesRepository.existsBy({ name: createCategoryDto.name });
        if (duplicateNameCategory) throw new BadRequestException(`category with name ${createCategoryDto.name} already exists`);

        const newCategory = new Category();
        newCategory.name = createCategoryDto.name;

        return await this.categoriesRepository.save(newCategory);
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {

        const duplicateNameCategory = await this.categoriesRepository.existsBy({ name: updateCategoryDto.name });
        if (duplicateNameCategory) throw new BadRequestException(`category with name ${updateCategoryDto.name} already exists`);

        const category = await this.findById(id);
        category.name = updateCategoryDto.name;

        return await this.categoriesRepository.save(category);

    }

    async remove(id: number): Promise<Category> {
        const category = await this.findById(id);
        return await this.categoriesRepository.remove(category);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoriesRepository.find();
    }

}