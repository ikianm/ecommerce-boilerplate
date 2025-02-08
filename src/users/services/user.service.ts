import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "../user.entity";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UpdateUserRoleDto } from "../dtos/update-user-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new BadRequestException(`No user found with id ${id}`);
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new BadRequestException(`No user found with id ${id}`);
        Object.assign(user, updateUserDto);
        return await this.usersRepository.save(user);
    }

    async changeUserRole(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new BadRequestException(`No user found with id ${id}`);
        user.role = updateUserRoleDto.role;
        return await this.usersRepository.save(user);
    }

    async delete(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new BadRequestException(`No user found with id ${id}`);
        return await this.usersRepository.remove(user);
    }

}