import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
})
export class UsersModule {}
