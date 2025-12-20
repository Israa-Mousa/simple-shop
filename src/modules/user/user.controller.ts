import { Controller, Get, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @Get()
  findAll() {
    return this.userService.findAll();
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
