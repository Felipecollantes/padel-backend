import { Module } from '@nestjs/common';
import { LeagueService } from './services/league.service';
import { LeagueController } from './controller/league.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { User } from 'src/users/entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { UserLeague } from './entities/leagues_users.entity';
import { LeagueUserController } from './controller/leagues_users.controller';
import { Match } from '../matches/entities/match.entity';

@Module({
  controllers: [LeagueController, LeagueUserController],
  providers: [LeagueService],
  imports: [TypeOrmModule.forFeature([League, User, UserLeague, Match]), SharedModule],
})
export class LeagueModule {}
