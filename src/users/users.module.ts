import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from 'src/auth/guards/authorize.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[TypeOrmModule.forFeature([User]),
          forwardRef(()=>AuthModule),
        ConfigModule.forFeature(authConfig),
        JwtModule.registerAsync(authConfig.asProvider())
      ],
  exports:[UsersService]
})
export class UsersModule {}
