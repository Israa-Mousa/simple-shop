import { Controller, Get, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import type { PaginationQueryType } from '../auth/types/util.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



   @Get()
  findAll(@Query() query: PaginationQueryType = { limit: 10, page: 1 }) {
    return this.userService.findAll({
      limit: Number(query.limit),
      page: Number(query.page),
    } as Required<PaginationQueryType>);
  }


  @Get(':id')
  findOne(@Param('id') id: bigint) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: bigint) {
    return this.userService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: bigint) {
    return this.userService.remove(id);
  }
}
