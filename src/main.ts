import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:6200',
      'http://localhost:6100',
      'https://uncognisable-lorrine-superthankfully.ngrok-free.dev',
    ], // آدرس Angular
    credentials: true,
  });

  // ValidationPipe برای DTOها و جلوگیری از ورود داده اشتباه
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // فقط فیلدهای تعریف شده در DTO قبول می‌شوند
      forbidNonWhitelisted: true, // فیلد اضافی ممنوع
      transform: true, // تبدیل خودکار رشته به number و غیره
    }),
  );
  app.enableCors();

  // Exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Bike Rental API')
    .setDescription('API documentation for Bike Rental System')
    .setVersion('1.0')
    .addBearerAuth() // JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
