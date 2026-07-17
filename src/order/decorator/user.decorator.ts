import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from 'src/interfaces/interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user; // Passport populates this after authentication
  },
);
