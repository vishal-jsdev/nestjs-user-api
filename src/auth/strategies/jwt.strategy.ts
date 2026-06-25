// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../constant/auth.constant';

interface JwtPayload {
  sub: number;
  email: string;
  roles: Role;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract the JWT from the "Authorization: Bearer <TOKEN>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Reject expired tokens automatically
      ignoreExpiration: false,
      // Change this to a secure environment variable in production
      secretOrKey: process.env.JWT_TOKEN_SECRET + '',
    });
  }

  // Passport automatically decodes the signature. If valid, it passes the payload here.
  async validate(payload: JwtPayload) {
    // The returned object is automatically attached to the Request object as req.user
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
