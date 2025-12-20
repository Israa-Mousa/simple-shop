import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDTO, RegisterDTO,  UserResponseDTO } from './dto/auth.dto';
import { User } from 'generated/prisma';

interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() registerDTO: RegisterDTO):Promise<UserResponseDTO> {
    return this.authService.register(registerDTO);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDTO): Promise<UserResponseDTO> {
    return this.authService.login(loginDto);
  }

  @Get('validate')
  validate(@Req() request: AuthenticatedRequest): UserResponseDTO {
    return this.authService.validate(request.user!);
  }

}
  