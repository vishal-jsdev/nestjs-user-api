import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import envValidator from './config/env.validation';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthorizeGuard } from './auth/guards/authorize.guard';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import authConfig from './auth/config/auth.config';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import emailConfig from './config/email.config';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [appConfig, databaseConfig, emailConfig],
      validationSchema: envValidator,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        //entities: [User],
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
      }),
    }),
    AuthModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    ProductModule,
    OrderModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [createKeyv(process.env.REDIS_URL)],
        ttl: 10 * 60 * 1000,
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'sandbox.smtp.mailtrap.io', // Use Mailtrap or Ethereal for simulation
          port: 2525,
          auth: {
            user: configService.get('email.username'),
            pass: configService.get('email.password'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthorizeGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
