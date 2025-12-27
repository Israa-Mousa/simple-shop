import { Injectable, Query } from '@nestjs/common';
import { RegisterDTO } from '../auth/dto/auth.dto';
import { DatabaseService } from '../database/database.service';
import { removeFields } from 'src/utils/object.utils';
import type { PaginatedResult, PaginationQueryType } from '../auth/types/util.type';
import { $Enums, User } from 'generated/prisma';
import type { UpdateUserDTO } from './dto/user.dto';

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
    findAll(
    query: PaginationQueryType,
  ): Promise<PaginatedResult<Omit<User, 'password'>>> {
    return this.prismaService.$transaction(async (prisma) => {
      const pagination = this.prismaService.handleQueryPagination(query);
      const users = await prisma.user.findMany({
        ...removeFields(pagination, ['page']),
        omit: {
          password: true,
        },
      });
      const count = await prisma.user.count();
      return {
        data: users,
        ...this.prismaService.formatPaginationResponse({
          page: pagination.page,
          count,
          limit: pagination.take,
        }),
      };
    });
  }
  findOne(id: bigint) {
  return this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isDeleted: true,
      },
    }); 
  }

 update(id: bigint, userUpdatePayload: UpdateUserDTO) {
    return this.prismaService.user.update({
      where: { id },
      data: userUpdatePayload,
      // omit: { password: true },
       select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isDeleted: true,
      },

    });
  }
remove(id: bigint) {
    return this.prismaService.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
  mapUserWithoutPasswordAndCastBigint(user: any) {
    const withoutPassword = removeFields(user, ['password']) as any;
    if (withoutPassword && Object.prototype.hasOwnProperty.call(withoutPassword, 'id')) {
      withoutPassword.id = String(withoutPassword.id);
    }
    return withoutPassword;
  }
   findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
