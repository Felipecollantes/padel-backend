import { CreateLeagueDto } from './create-league.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateLeagueDto extends PartialType(CreateLeagueDto) {}
