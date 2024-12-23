import { Module } from '@nestjs/common';
import { MatchesController } from './controller/matches.controller';
import { MatchesService } from './services/matches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { League } from 'src/league/entities/league.entity';
import { SharedModule } from 'src/shared/shared.module';
import { User } from 'src/users/entities/user.entity';
import { UserLeague } from 'src/league/entities/leagues_users.entity';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  imports: [TypeOrmModule.forFeature([Match, League, User, UserLeague]), SharedModule],
})
export class MatchesModule {}
