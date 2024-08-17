import { Module } from '@nestjs/common';
import { DrivingController } from './driving.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	controllers: [DrivingController],
})
export class DrivingModule {}
