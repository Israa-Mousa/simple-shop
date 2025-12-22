import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDTO, RegisterDTO,  UserResponseDTO } from './dto/auth.dto';
import { User } from 'generated/prisma';
import { IsPublic } from 'src/decorators/public.decorator';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { registerValidationSchema } from './util/auth-validation.schema';

interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
 @Post('register')
  @IsPublic()
  async create(
    @Body(new ZodValidationPipe(registerValidationSchema))
    registerDTO: RegisterDTO,
  ): Promise<UserResponseDTO> {
    const createdUser = await this.authService.register(registerDTO);
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
  