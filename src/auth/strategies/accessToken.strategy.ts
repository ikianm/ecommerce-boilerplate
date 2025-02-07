import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { StrategyEnum } from "./strategy.enum";
import IJwtPayload from "./jwtPayload.interface";


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, StrategyEnum.JWT) {

    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') as string
        });
    }

    validate(payload: IJwtPayload) { // if JWT is valid, this function gets called with decoded JWT as its parameter
        return payload;
    }

}