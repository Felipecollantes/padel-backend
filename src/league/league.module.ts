import { Module } from '@nestjs/common';
import { LeagueService } from './services/league.service';
import { LeagueController } from './controller/league.controller';

@Module({
  controllers: [LeagueController],
  providers: [LeagueService],
})
export class LeagueModule {}
