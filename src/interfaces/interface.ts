import { Request } from 'express';
import { Role } from 'src/auth/constant/auth.constant';
export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
}
export interface AuthRequest extends Request {
  user: JwtPayload;
}
