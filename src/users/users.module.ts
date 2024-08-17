import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
	],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}

