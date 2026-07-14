import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/constant/auth.constant';

interface AuthRequest extends Request {
  user: JwtPayload;
}
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user; // Passport populates this after authentication
  },
);
