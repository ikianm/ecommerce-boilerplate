import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { CreateUserDto } from "../../common/dtos/create-user.dto";
import { UsersRepository } from "../user.repository";
import { UpdateUserDto } from "../../common/dtos/update-user.dto";

@Injectable()
export class UsersApiService {

    constructor(
        private readonly usersRepository: UsersRepository
    ) { }

    async userExists(email: string): Promise<boolean> {
        return await this.usersRepository.exists(email);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return await this.usersRepository.create(createUserDto);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new BadRequestException(`no user found with id ${id}`);
        return await this.usersRepository.update(user, updateUserDto);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.finByEmail(email);
    }

    async findById(id: number): Promise<User | null> {
        return await this.usersRepository.findById(id);
    }

}