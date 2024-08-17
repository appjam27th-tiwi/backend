import { Controller, Get, Query, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import axios from 'axios';

@Controller('driving')
export class DrivingController {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {
	}

	@Get('/')
	async driving(
		@Query('start') start: string,
		@Query('goal') goal: string,
		@Query('waypoints') waypoints: string,
		@Res() res: Response
	) {
		try {
			const result = await axios.get(`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${ start }&goal=${ goal }&waypoints=${ waypoints }`, {
				headers: {
					'X-NCP-APIGW-API-KEY-ID': this.configService.get('NAVER_CLIENT_ID'),
					'X-NCP-APIGW-API-KEY': this.configService.get('NAVER_CLIENT_SECRET'),
				},
			})

			console.log(result.data);

			return res.json(result.data);
		} catch (error) {
			console.error(error);
			return {
				status: 'error',
				message: error.message
			}
		}
	}
}
