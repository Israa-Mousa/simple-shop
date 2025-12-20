import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDTO, RegisterDTO,  UserResponseDTO } from './dto/auth.dto';
import { User } from 'generated/prisma';
import { IsPublic } from 'src/decorators/public.decorator';

interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
   @IsPublic()
  create(@Body() registerDTO: RegisterDTO):Promise<UserResponseDTO> {
    const createdUser = this.authService.register(registerDTO);
    return createdUser;
  }

  @Post('/login')
  @IsPublic()
  login(@Body() loginDto: LoginDTO): Promise<UserResponseDTO> {
    return this.authService.login(loginDto);
  }

  @Get('validate')
  validate(@Req() request: AuthenticatedRequest): UserResponseDTO {
    return this.authService.validate(request.user!);
  }

}
  