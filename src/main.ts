import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    name: 'session',
    keys: ['chibao'],
    maxAge: 24 * 60 * 60 * 1000
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //loại bỏ các trường không có trong dto
      forbidNonWhitelisted: true //Phần này để thông báo lỗi khi trường ko có trong dto
    })
  )
  await app.listen(3000);
}
bootstrap();
