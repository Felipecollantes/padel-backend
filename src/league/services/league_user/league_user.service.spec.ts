import { Test, TestingModule } from '@nestjs/testing';
import { LeagueUserService } from './league_user.service';

describe('LeagueUserService', () => {
  let service: LeagueUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeagueUserService],
    }).compile();

    service = module.get<LeagueUserService>(LeagueUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
