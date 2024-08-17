import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	@Get('/user/login/kakao')
	@UseGuards(AuthGuard('kakao'))
	async kakaoAuth(@Req() _req: Request) {
	}

	/* Get kakao Auth Callback */
	@Get('/auth/kakao/callback')
	@UseGuards(AuthGuard('kakao'))
	async kakaoAuthCallback(
		@Req() req: Request,
		@Res() res: Response,
	) {
		const { user } = req;
		console.log(user);

		return this.authService.kakaoLogin(req, res);
	}
}
