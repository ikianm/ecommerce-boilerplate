import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../common/dtos/create-user.dto";
import { AuthDto } from "./dtos/auth.dto";
import { Request } from "express";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { RefreshTokenGuard } from "../common/guards/refreshToken.guard";


@Controller('auth',)
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto);
    }

    @Post('signin')
    signIn(@Body() authDto: AuthDto) {
        return this.authService.signIn(authDto);
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logOut(@Req() req: Request) {
        if (!req.user) return;
        return this.authService.logOut(req.user['id']);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refreshTokens')
    refreshTokens(@Req() req: Request) {
        if (!req.user) return;
        return this.authService.refreshTokens(req.user['id'], req.user['refreshToken']); //refreshToken is appended to req.user in RefreshTokenStrategy
    }

}