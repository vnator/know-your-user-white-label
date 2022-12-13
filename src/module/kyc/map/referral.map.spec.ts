import { fake } from 'test/mock';
import { CreateReferralDto } from '../dto/referral.dto';
import { Referral } from '../entity/referral';
import { mapDto, mapEntity } from './referral.map';

describe('ReferralMapDto', () => {
  let dto: CreateReferralDto;
  let entity: Referral;
  beforeEach(() => {
    dto = fake(CreateReferralDto);
    entity = fake(Referral);
  });

  it('should map to entity', () => {
    const entity = mapDto(dto);
    expect(entity).toBeInstanceOf(Referral);
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
