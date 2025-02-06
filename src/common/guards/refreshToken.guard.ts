import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { StrategyEnum } from "../../auth/strategies/strategy.enum";


@Injectable()
export class RefreshTokenGuard extends AuthGuard(StrategyEnum.JWT_REFRESH) { }