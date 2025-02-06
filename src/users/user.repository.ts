import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { DeleteResult, Repository } from "typeorm";
import { CreateUserDto } from "../common/dtos/create-user.dto";
import { UpdateUserDto } from "../common/dtos/update-user.dto";


@Injectable()
export class UsersRepository {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        Object.assign(user, createUserDto);
        return await this.usersRepository.save(user);
    }

    // async findAll(): Promise<User[]> {
    //     return await this.usersRepository.find();
    // }

    async findById(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id });
    }

    async finByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOneBy({ email });
    }

    async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
        Object.assign(user, updateUserDto);
        return await this.usersRepository.save(user);
    }

    // async remove(id: number): Promise<User | null> {
    //     const user = await this.findById(id);
    //     if (!user) return null;
    //     return await this.usersRepository.remove(user);
    // }

    async exists(email: string): Promise<boolean> {
        return await this.usersRepository.existsBy({ email });
    }
}