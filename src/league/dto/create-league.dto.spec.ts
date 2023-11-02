import { validate } from 'class-validator';
import { CreateLeagueDto } from './create-league.dto';
import 'reflect-metadata';

describe('CreateLeagueDto', () => {
  it('should validate the name is not empty', async () => {
    const dto = new CreateLeagueDto();
    dto.name = null;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toBeDefined();
    expect(errors[0].constraints.isString).toEqual('El nombre es obligatorio.');
  });

  it('should validate the name is a string', async () => {
    const dto = new CreateLeagueDto();
    dto.name = 123 as any;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({
      isString: 'El nombre es obligatorio.',
    });
  });

  it('should allow optional participants field', async () => {
    const dto = new CreateLeagueDto();
    dto.name = 'Champions League';
    dto.participants = undefined;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate that participants is an array if provided', async () => {
    const dto = new CreateLeagueDto();
    dto.name = 'Champions League';
    dto.participants = 'not-an-array' as any;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('participants');
    expect(errors[0].constraints).toEqual({
      isArray: 'participants must be an array',
    });
  });
});
