import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UsersService } from "./services/user.service";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UpdateUserRoleDto } from "./dtos/update-user-role.dto";
import { Request } from "express";


@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) { }

    @UseGuards(AccessTokenGuard)
    @Get('me')
    findMe(@Req() req: Request) {
        if (!req.user) throw new UnauthorizedException('User is not logged in');
        return this.usersService.findOne(req.user.id);
    }

    @UseGuards(AccessTokenGuard)
    @Put('me')
    updateMe(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
        if (!req.user) throw new UnauthorizedException('User is not logged in');
        return this.usersService.update(req.user.id, updateUserDto);
    }

    @UseGuards(AccessTokenGuard)
    @Delete('deleteAccount')
    deleteAccount(@Req() req: Request) {
        if (!req.user) throw new UnauthorizedException('User is not logged in');
        return this.usersService.delete(req.user.id);
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(parseInt(id), updateUserDto);
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Patch(':id')
    changeRole(@Param('id') id: string, @Body() changeUserRoleDto: UpdateUserRoleDto) {
        return this.usersService.changeUserRole(parseInt(id), changeUserRoleDto);
    }

    @UseGuards(AccessTokenGuard, AdminGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(parseInt(id));
    }

}