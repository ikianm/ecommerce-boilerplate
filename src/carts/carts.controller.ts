import { Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
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

    @Put(':productId')
    increaseCartItemQuantity(@Param('productId') productId: string, @Req() req: Request) {
        return this.cartsService.increaseCartItemQuantity(req.user!.id, parseInt(productId));
    }

    @Delete(':productId')
    removeCartItem(@Param('productId') productId: string, @Req() req: Request) {
        console.log('removeCartItem triggered')
        return this.cartsService.removeCartItem(req.user!.id, parseInt(productId));
    }

    @Delete()
    clear(@Req() req: Request) {
        return this.cartsService.clear(req.user!.id);
    }


}