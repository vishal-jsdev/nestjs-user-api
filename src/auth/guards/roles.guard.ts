import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constant/auth.constant';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the roles metadata required for the specific endpoint
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If no roles are required, allow open access
    if (!requiredRoles) {
      return true;
    }

    // 3. Extract user from the request (populated previously by an AuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 4. Validate if the user holds a required role
    return requiredRoles.some((role) => user?.roles === role);
  }
}
