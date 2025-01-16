import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './filters/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Setup filters
  const httpAdapter = app.getHttpAdapter();
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Setup interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Setup CORS and Swagger for development
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('Task Management API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
