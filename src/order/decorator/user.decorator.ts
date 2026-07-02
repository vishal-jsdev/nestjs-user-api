import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface JwtPayload {
  sub: number;
  email: string;
}
interface AuthRequest extends Request {
  user: JwtPayload;
}
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user; // Passport populates this after authentication
  },
);
