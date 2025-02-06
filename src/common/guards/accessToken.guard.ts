import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { StrategyEnum } from "../../auth/strategies/strategy.enum";


@Injectable()
export class AccessTokenGuard extends AuthGuard(StrategyEnum.JWT) { }