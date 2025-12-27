import { Controller, Get, Patch, Param, Delete, Query, Body } from '@nestjs/common';
import { UserService } from './user.service';
import type { PaginationQueryType } from '../auth/types/util.type';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import type{ UpdateUserDTO } from './dto/user.dto';
import { updateUserValidationSchema } from './util/user.validation.schema';
import { paginationSchema } from 'src/utils/api.utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



   @Get()
  findAll(@Query(new ZodValidationPipe(paginationSchema)) 
 query:PaginationQueryType) {
    return this.userService.findAll(query);
  }


  @Get(':id')
  findOne(@Param('id') id: bigint) {
    return this.userService.findOne(id);
  }

   @Patch(':id')
  update(
    @Param('id') id: bigint,
    @Body(new ZodValidationPipe(updateUserValidationSchema))
    userUpdatePayload: UpdateUserDTO,
  ) {
    return this.userService.update(id, userUpdatePayload);
  }

  @Delete(':id')
  remove(@Param('id') id: bigint) {
    return this.userService.remove(id);
  }
}
