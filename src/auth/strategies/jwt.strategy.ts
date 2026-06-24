// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
  async validate(payload: any) {
    // The returned object is automatically attached to the Request object as req.user
    console.log(payload);
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
