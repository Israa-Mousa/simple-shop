import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private jwtService:JwtService,
    private configService:ConfigService<{JWT_SECRET:string}>,
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
  return { user:this.userService.mapUserWithoutPasswordAndCastBigint(createdUser), token };
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

    //return user + token (convert id to string)
    return { user: this.userService.mapUserWithoutPasswordAndCastBigint(foundUser), token };
  }

  private hashPassword(password: string) {
    // Implement password hashing logic here
    return  argon.hash(password);
  }
  private verifyPassword(password: string, hashedPassword: string) {
    // Implement password verification logic here
    return argon.verify(hashedPassword, password);
  }
  private generateJwtToken(userId: bigint | number | string, role: UserRole) {
    //const sub = typeof userId === 'bigint' ? userId.toString() : String(userId);
    return this.jwtService.sign(
      { sub:String(userId), role },
      { expiresIn: '30d' },
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
