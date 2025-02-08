import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { Repository } from "typeorm";

@Injectable()
export class UsersApiService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) { }

    async userExists(email: string): Promise<boolean> {
        return await this.usersRepository.existsBy({ email });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = new User();
        Object.assign(newUser, createUserDto);
        return await this.usersRepository.save(newUser);
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