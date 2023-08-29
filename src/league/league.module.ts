import { Module } from '@nestjs/common';
import { LeagueService } from './services/league.service';
import { LeagueController } from './controller/league.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [LeagueController],
  providers: [LeagueService],
  imports: [TypeOrmModule.forFeature([League, User])],
})
export class LeagueModule {}