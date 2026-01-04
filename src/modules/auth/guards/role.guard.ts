import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'generated/prisma/wasm';
import { Roles } from 'src/decorators/role.decorato';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!roles.includes(user.role)) {
      throw new ForbiddenException();
    }
    return true;
  }
}