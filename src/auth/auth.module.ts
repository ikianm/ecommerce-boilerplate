import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { UsersModule } from "../users/user.module";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports: [
        JwtModule.register({}),
        UsersModule
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule { }