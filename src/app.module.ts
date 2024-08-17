import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validationSchema';
import { GeminiModule } from './gemini/gemini.module';
import { DrivingModule } from './driving/driving.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
      validationSchema,
    }),
    GeminiModule,
    DrivingModule
  ],
})
export class AppModule {}
