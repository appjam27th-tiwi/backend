import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )

  app.enableCors({
    origin: ['*'],
    credentials: true,
    methods: ['*'],
    allowedHeaders: ['*']
  })

  await app.listen(8031);
}
bootstrap();
