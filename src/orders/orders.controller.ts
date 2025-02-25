import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Request } from 'express';
import { CreateOrderDto } from './dtos/create-order.dto';

@UseGuards(AccessTokenGuard)
@Controller('orders')
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  findUserOrders(@Req() req: Request) {
    return this.ordersService.findUserOrders(req.user!.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.ordersService.findOne(parseInt(id), req.user!.id);
  }

  @Post()
  create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user!.id, createOrderDto);
  }

}

