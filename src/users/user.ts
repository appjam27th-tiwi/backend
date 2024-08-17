import { UserEntity } from './entity/user.entity';

export class User {
	constructor(
		id: string,
		nickname: string,
		email: string,
		profile: string,
		createdAt: Date,
		updatedAt: Date,
	) {
		this.id = id;
		this.nickname = nickname;
		this.email = email;
		this.profile = profile;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	id: string;
	nickname: string;
	email: string;
	profile: string;
	createdAt: Date;
	updatedAt: Date;

	static fromEntity(entity: UserEntity): User | undefined {
		if (!entity) {
			return undefined;
		}

		return new User(
			entity.id,
			entity.nickname,
			entity.email,
			entity.profile,
			entity.createdDate,
			entity.updatedDate,
		);
	}
}
