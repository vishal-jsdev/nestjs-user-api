import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true, // Only returns fields explicitly marked @Expose()
    }),
  );

  // 1. Build the Swagger configuration object
  const config = new DocumentBuilder()
    .setTitle('Inventory API Example')
    .setDescription('The inventory API description')
    .setVersion('1.0')
    .build();

  // 2. Create the JSON document
  const document = SwaggerModule.createDocument(app, config);

  // 3. Setup the UI route (accessible at http://localhost:3000/api)
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
