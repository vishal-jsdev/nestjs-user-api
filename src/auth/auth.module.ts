import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import authConfig from './config/auth.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  controllers: [AuthController],
  providers: [AuthService, {
    provide: HashingProvider,
    useClass: BcryptProvider
  }],
  imports:[forwardRef(()=>UsersModule),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider())
  ],
  exports:[HashingProvider]
})
export class AuthModule {}
