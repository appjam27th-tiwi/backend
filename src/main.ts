import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )

  app.enableCors({
    origin: [ 'http://localhost:5173', 'https://f9e9-218-234-61-40.ngrok-free.app/', 'https://appjam27.devfiro.com' ],
    credentials: true,
    methods: ['*'],
    allowedHeaders: ['*']
  })

  await app.listen(8031);
}
bootstrap();
