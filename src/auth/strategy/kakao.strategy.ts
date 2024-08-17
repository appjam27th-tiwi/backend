import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({	// 여기 적어준 정보를 가지고 카카오 서버에 POST /oauth/token 요청이 날아갑니다.
			clientID: configService.get('KAKAO_CLIENT_ID'),
			clientSecret: configService.get('KAKAO_CLIENT_SECRET'),
			callbackURL: configService.get('KAKAO_CALLBACK_URL'),
		});
	}

	async validate(	// POST /oauth/token 요청에 대한 응답이 담깁니다.
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: (error: any, user?: any, info?: any) => void,
	) {
		try {
			const { _json } = profile;
			const user = {
				kakaoId: _json.id,
				email: _json.kakao_account.email,
				nickname: _json.properties.nickname,
				photo: _json.properties.profile_image,
			};
			done(null, user);
		} catch (error) {
			done(error);
		}
	}
}
