import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { StrategyEnum } from "./strategy.enum";
import IJwtPayload from "./jwtPayload.interface";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, StrategyEnum.JWT_REFRESH) {

    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') as string,
            passReqToCallback: true
        });
    }

    validate(req: Request, payload: IJwtPayload) {
        const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }

}