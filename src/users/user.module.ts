import { Module } from "@nestjs/common";
import { UsersController } from "./user.controller";
import { UsersService } from "./services/user.service";
import { UsersApiService } from "./services/userApi.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersApiService],
    exports: [UsersApiService]
})
export class UsersModule { }