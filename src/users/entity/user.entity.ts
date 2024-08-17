import {
	Column,
	CreateDateColumn,
	Entity, PrimaryColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	nickname: string;

	@Column({ unique: true})
	email: string;

	@Column()
	profile: string;

	@Column({nullable: true})
	refreshToken: string;

	@CreateDateColumn({ type: 'datetime' })
	createdDate: Date;

	@UpdateDateColumn({ type: 'datetime' })
	updatedDate: Date;
}
