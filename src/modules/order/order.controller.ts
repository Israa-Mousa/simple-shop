import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/decorators/role.decorato';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { createOrderDTOValidationSchema } from './util/order.validation.schema';
import type { CreateOrderDTO, CreateOrderResponseDTO, OrderOverviewResponseDTO, OrderResponseDTO } from './types/oder.dto';
import { paginationSchema } from 'src/utils/api.utils';
import type { PaginatedResult, PaginationQueryType } from 'src/types/util.types';
import { Or } from 'generated/prisma/runtime/library';
import { request } from 'express';

@Controller('order')
@Roles(['CUSTOMER'])
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

   @Post()
  create(
    @Body(new ZodValidationPipe(createOrderDTOValidationSchema))
    createOrderDto: CreateOrderDTO,

    @Req() request: Express.Request,
  ): Promise<CreateOrderResponseDTO> {
    return this.orderService.create(createOrderDto, BigInt(request.user!.id));
  }

  @Get()
  findAll(
    @Req() request: Express.Request,

    @Query(new ZodValidationPipe(paginationSchema))
    query: PaginationQueryType,
  ): Promise<PaginatedResult<OrderOverviewResponseDTO>> {
    return this.orderService.findAll(BigInt(request.user!.id), query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() request: Express.Request,
  ): Promise<OrderResponseDTO> {
    return this.orderService.findOne(+id, BigInt(request.user!.id));
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
