import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { Repository } from 'typeorm';
import { Request,Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	async kakaoLogin(
		req: Request,
		res: Response,
	) {
		try {
			const { user } = req;

			// 유저 중복 검사
			let findUser = await this.usersRepository.findOne({
				where: {
					id: user.kakaoId,
					email: user.email,
				}
			});


			// 없는 유저면 DB에 유저정보 저장
			if (!findUser) {
				const userEntity = new UserEntity();
				userEntity.id = user.kakaoId;
				userEntity.email = user.email;
				userEntity.nickname = user.nickname;
				userEntity.profile = user.photo;

				console.log('userEntity', userEntity)

				try {
					findUser = await this.usersRepository.save(userEntity);
					console.log('Saved user:', findUser);
				} catch (saveError) {
					console.error('Error saving user:', saveError);
					throw new UnauthorizedException('Failed to save user to the database');
				}
			}

			// 구글 가입이 되어 있는 경우 accessToken 및 refreshToken 발급
			const findUserPayload = { id: findUser.id };
			const accessToken = this.jwtService.sign(
				findUserPayload,
				{
					secret: 	this.configService.get('JWT_ACCESS_SECRET'),
					expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
					audience: String(findUser.id),
				},
			);
			const refreshToken = this.jwtService.sign(
				{},
				{
					secret: 	this.configService.get('JWT_REFRESH_SECRET'),
					expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
					audience: String(findUser.id),
				},
			);

			/* refreshToken 필드 업데이트 */
			findUser.refreshToken = refreshToken;

			await this.usersRepository.save(findUser);

			// 쿠키 설정
			const now = new Date();
			now.setDate(now.getDate() + +this.configService.get('JWT_REFRESH_EXPIRES_IN'));
			res.cookie('eid_refresh_token', refreshToken, {
				expires: now,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			});
			return {
				success: true,
				accessToken
			};
		} catch (error) {
			return { success: false, error: '카카오 로그인 인증을 실패 하였습니다.' };
		}
	}
}
