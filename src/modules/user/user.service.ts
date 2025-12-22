import { Injectable, Query } from '@nestjs/common';
import { RegisterDTO } from '../auth/dto/auth.dto';
import { DatabaseService } from '../database/database.service';
import { removeFields } from 'src/utils/object.utils';
import type { PaginatedResult, PaginationQueryType } from '../auth/types/util.type';
import { User } from 'generated/prisma';

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
    query: Required<PaginationQueryType>,
  ): Promise<PaginatedResult<Omit<User, 'password'>>> {
    return this.prismaService.$transaction(async (prisma) => {
      const users = await prisma.user.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        // omit: {
        //   password: true,
        // },
      });
      const count = await prisma.user.count();
      return {
        data: users,
        meta: {
          total: count,
          page: query.page,
          limit: query.limit,
          totalPages: Math.ceil(count / query.limit),
        },
      };
    });
  }

  findOne(id: bigint) {
  return this.prismaService.user.findUnique({
      where: {
        id
      }
    }); 
  }

  update(id: bigint) {
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
