import { fake } from 'test/mock';
import { CreatePlanPreferenceDto } from '../dto/plan-preference.dto';
import { PlanPreference } from '../entity/plan-preference';
import { mapDto, mapEntity } from './plan-preference.map';

describe('PlanPreferenceMapDto', () => {
  let dto: CreatePlanPreferenceDto;
  let entity: PlanPreference;
  beforeEach(() => {
    dto = fake(CreatePlanPreferenceDto);
    entity = fake(PlanPreference);
  });

  it('should map to entity', () => {
    const entity = mapDto(dto);
    expect(entity).toBeInstanceOf(PlanPreference);
    expect(entity.customerReferenceId).toEqual(dto.customerReferenceId);
    expect(entity.choices).toEqual(dto.data);
  });

  it('should map to dto', () => {
    const dto = mapEntity(entity);
    expect(dto.customerReferenceId).toEqual(entity.customerReferenceId);
    expect(dto.data).toEqual(entity.choices);
    expect(dto.createdAt).toEqual(entity.createdAt.toISOString());
    expect(dto.updatedAt).toEqual(entity.updatedAt.toISOString());
    expect(dto.id).toEqual(entity.id);
  });
});
