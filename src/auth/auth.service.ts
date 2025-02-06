import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { UsersApiService } from "../users/services/userApi.service";
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "../common/dtos/create-user.dto";
import * as argon2 from 'argon2';
import { AuthDto } from "./dtos/auth.dto";

@Injectable()
export class AuthService {

    constructor(
        private readonly usersApiService: UsersApiService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async signUp(createUserDto: CreateUserDto) {
        const userExists = await this.usersApiService.userExists(createUserDto.email);
        if (userExists) throw new BadRequestException(`Email ${createUserDto.email} is already in use`);

        const hashedPassword = await argon2.hash(createUserDto.password);
        const newUser = await this.usersApiService.create({ ...createUserDto, password: hashedPassword });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);

        return tokens;
    }

    async signIn(authDto: AuthDto) {
        const user = await this.usersApiService.findByEmail(authDto.email);
        if (!user) throw new BadRequestException(`No user found with email ${authDto.email}`);

        const passwordMatches = await argon2.verify(user.password, authDto.password);
        if (!passwordMatches) throw new BadRequestException('Incorrect password');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logOut(id: number) {
        return this.usersApiService.update(id, { refreshToken: null });
    }

    async refreshTokens(id: number, refreshToken: string) {
        const user = await this.usersApiService.findById(id);
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

        const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async updateRefreshToken(id: number, refreshToken: string) {
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.usersApiService.update(id, { refreshToken: hashedRefreshToken });
    }

    async getTokens(id: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { id, email },
                { secret: this.configService.get<string>('JWT_ACCESS_SECRET'), expiresIn: '1h' }
            ),
            this.jwtService.signAsync(
                { id, email },
                { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: '7d' }
            )
        ]);

        return { accessToken, refreshToken };
    }

}