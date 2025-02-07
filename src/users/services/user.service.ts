import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersRepository } from "../user.repository";
import { User } from "../user.entity";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UpdateUserRoleDto } from "../dtos/update-user-role.dto";


@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.findAll();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new BadRequestException(`No user found with id ${id}`);
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new BadRequestException(`No user found with id ${id}`);
        return await this.usersRepository.update(user, updateUserDto);
    }

    async changeUserRole(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<User> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new BadRequestException(`No user found with id ${id}`);
        return await this.usersRepository.updateRole(user, updateUserRoleDto);
    }

    async delete(id: number): Promise<User> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new BadRequestException(`No user found with id ${id}`);
        return await this.usersRepository.delete(user);
    }

}