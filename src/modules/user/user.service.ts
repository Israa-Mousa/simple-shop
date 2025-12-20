import { Injectable } from '@nestjs/common';
import { RegisterDTO } from '../auth/dto/auth.dto';
import { DatabaseService } from '../database/database.service';
import { removeFields } from 'src/utils/object.utils';

@Injectable()
export class UserService {
  constructor(private prismaService: DatabaseService) {}
  create(registerDTO: RegisterDTO) {
     return this.prismaService.user.create({
      data: registerDTO
      })
  }

  findByEmailOrThrow(email: string) {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        email
      }
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: bigint) {
    return `This action returns a #${id} user`;
  }

  update(id: bigint,

   ) {
    return `This action updates a #${id} user`;
  }

  remove(id: bigint) {
    return `This action removes a #${id} user`;
  }
  mapUserWithoutPasswordAndCastBigint(user: any) {
    const withoutPassword = removeFields(user, ['password']) as any;
    if (withoutPassword && Object.prototype.hasOwnProperty.call(withoutPassword, 'id')) {
      withoutPassword.id = String(withoutPassword.id);
    }
    return withoutPassword;
  }
}
