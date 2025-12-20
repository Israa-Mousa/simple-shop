import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO, RegisterDTO, UserResponseDTO } from './dto/auth.dto';
import * as argon from 'argon2';
import { UserService } from '../user/user.service';
import { removeFields } from 'src/utils/object.utils';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'generated/prisma';
@Injectable()
export class AuthService {
  constructor(
    private userService:UserService,
    private jwtService:JwtService
   ) {}
  async register(registerDTO: RegisterDTO): Promise<UserResponseDTO>   {
    //hash password
   const hashedPassword = await this.hashPassword(registerDTO.password);
    //store user in db
   const createdUser = await this.userService.create
   ({
    ...registerDTO, 
    password: hashedPassword
  });
  // const createdUserWithoutPassword =removeFields(createdUser, ['password']);
    //generate jwt token
    const token = this.generateJwtToken(createdUser.id, createdUser.role);
    
    //return user + token
  return { user:this.userService.mapUserWithoutPassword(createdUser), token };
  }

  async login(loginDto: LoginDTO): Promise<UserResponseDTO> {
    //find user by email
    const foundUser = await this.userService.findByEmailOrThrow(loginDto.email);
    //verify password with argon2
    const isPasswordValid = await this.verifyPassword(loginDto.password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //generate jwt token
    const token = this.generateJwtToken(foundUser.id, foundUser.role);
  
    //return user + token
    return { user: removeFields(foundUser, ['password']), token };
  }

  private hashPassword(password: string) {
    // Implement password hashing logic here
    return  argon.hash(password);
  }
  private verifyPassword(password: string, hashedPassword: string) {
    // Implement password verification logic here
    return argon.verify(hashedPassword, password);
  }
  private generateJwtToken(userId: bigint, role:UserRole) {
    // Implement JWT token generation logic here
    return  this.jwtService.sign({
       sub: userId, role },
       { expiresIn: '30d' }

    );
  }
      validate(userPayload: UserResponseDTO['user']) {
    // generate jwt token
    const token = this.generateJwtToken(
      BigInt(userPayload.id),
      userPayload.role,
    );
    // return user data + token
    return {
      user: userPayload,
      token,
    };
  }
}
