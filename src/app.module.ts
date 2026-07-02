import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import envValidator from './config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from './auth/guards/authorize.guard';
import { JwtModule } from '@nestjs/jwt';
import authConfig from './auth/config/auth.config';

const ENV = process.env.NODE_ENV
@Module({
  imports: [
    UsersModule, 
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: !ENV ? '.env':`.env.${ENV.trim()}`,
      load: [appConfig,databaseConfig],
      validationSchema: envValidator
    }),
    TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: (configService:ConfigService) => ({
      type: 'postgres',
      //entities: [User],
      autoLoadEntities:configService.get('database.autoLoadEntities'),
      synchronize: configService.get('database.synchronize'),
      host: configService.get('database.host'),
      port: +configService.get('database.port'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      database: configService.get('database.name')
    })
  }), AuthModule,ConfigModule.forFeature(authConfig),
          JwtModule.registerAsync(authConfig.asProvider())],
  controllers: [AppController],
  providers: [AppService,{
      provide: APP_GUARD,
      useClass: AuthorizeGuard
    }],
})
export class AppModule {}
