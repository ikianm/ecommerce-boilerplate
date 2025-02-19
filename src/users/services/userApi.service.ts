import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { DataSource, Repository } from "typeorm";
import { CartsApiService } from "../../carts/services/cartsApi.service";

@Injectable()
export class UsersApiService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly cartsApiService: CartsApiService,
        private readonly dataSource: DataSource
    ) { }

    async userExists(email: string): Promise<boolean> {
        return await this.usersRepository.existsBy({ email });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const newUser = new User();
            Object.assign(newUser, createUserDto);

            await queryRunner.manager.save(newUser);
            await this.cartsApiService.create(newUser, queryRunner);

            await queryRunner.commitTransaction();
            return newUser;

        } catch (err) {
            queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('could not save the new user');
        } finally {
            await queryRunner.release();
        }

    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new BadRequestException(`no user found with id ${id}`);
        Object.assign(user, updateUserDto);
        return await this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOneBy({ email });
    }

    async findById(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id });
    }

}