import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { CartsService } from "./services/carts.service";
import { Request } from "express";

@UseGuards(AccessTokenGuard)
@Controller('carts')
export class CartsController {

    constructor(private readonly cartsService: CartsService) { }

    @Get()
    findUsersCart(@Req() req: Request) {
        return this.cartsService.findUsersCart(req.user!.id);
    }

    @Post(':productId')
    addToCart(@Param('productId') productId: string, @Req() req: Request) {
        return this.cartsService.addToCart(req.user!.id, parseInt(productId));
    }

}