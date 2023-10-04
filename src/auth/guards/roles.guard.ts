import { EUserRoles } from '@database/schemas/types/roles.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<EUserRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requireRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    return requireRoles.some((role) => req.user.role.includes(role));
  }
}
