import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from '../services/matches.service';
import { CreateMatchDto } from '../dto/create-match.dto';
import { MatchResponseDto } from '../dto/response-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { NotFoundException } from '@nestjs/common';

describe('MatchesController', () => {
  let controller: MatchesController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: MatchesService;

  const mockMatchesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateMatchResult: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: mockMatchesService,
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a match', async () => {
    const createMatchDto = new CreateMatchDto(); // Assume it's already populated with test data
    const matchResponseDto = new MatchResponseDto(); // Mock the response DTO

    mockMatchesService.create.mockResolvedValue(matchResponseDto);

    expect(await controller.create(createMatchDto)).toBe(matchResponseDto);
    expect(mockMatchesService.create).toHaveBeenCalledWith(createMatchDto);
  });

  it('should list all matches', async () => {
    const matchResponseDtoArray = [new MatchResponseDto()]; // Mock an array of response DTOs

    mockMatchesService.findAll.mockResolvedValue(matchResponseDtoArray);

    expect(await controller.findAll()).toBe(matchResponseDtoArray);
    expect(mockMatchesService.findAll).toHaveBeenCalled();
  });

  it('should retrieve a match by id', async () => {
    const matchResponseDto = new MatchResponseDto(); // Mock the response DTO
    const matchId = 'some-uuid';

    mockMatchesService.findOne.mockResolvedValue(matchResponseDto);

    expect(await controller.findOne(matchId)).toBe(matchResponseDto);
    expect(mockMatchesService.findOne).toHaveBeenCalledWith(matchId);
  });

  it('should update a match', async () => {
    const updateMatchDto = new UpdateMatchDto(); // Assume it's already populated with test data
    const matchResponseDto = new MatchResponseDto(); // Mock the response DTO
    const matchId = 'some-uuid';

    mockMatchesService.update.mockResolvedValue(matchResponseDto);

    expect(await controller.update(matchId, updateMatchDto)).toBe(matchResponseDto);
    expect(mockMatchesService.update).toHaveBeenCalledWith(matchId, updateMatchDto);
  });

  it('should delete a match', async () => {
    const matchId = 'some-uuid';
    mockMatchesService.remove.mockResolvedValue(undefined);

    await controller.remove(matchId);
    expect(mockMatchesService.remove).toHaveBeenCalledWith(matchId);
  });

  it('should throw NotFoundException if match not found on delete', async () => {
    const matchId = 'some-uuid';
    mockMatchesService.remove.mockRejectedValue(new NotFoundException());

    await expect(controller.remove(matchId)).rejects.toThrow(NotFoundException);
    expect(mockMatchesService.remove).toHaveBeenCalledWith(matchId);
  });
});
