import { fake } from 'test/mock';
import { CreateMemberGetMemberDto } from '../dto/member-get-member.dto';
import { MemberGetMember } from '../entity/member-get-member';
import { MgmCodeKindEnum } from '../entity/mgm-code-kind-enum';
import { mapDto, mapEntity } from './member-get-member.map';

describe('MemberGetMemberMapDto', () => {
  let dto: CreateMemberGetMemberDto;
  let entity: MemberGetMember;

  beforeEach(() => {
    dto = fake(CreateMemberGetMemberDto);
    entity = fake(MemberGetMember);
  });

  it('should map dto to entity', () => {
    const entity = mapDto(dto);
    expect(entity).toBeInstanceOf(MemberGetMember);
    expect(entity.codeKind).toBe(MgmCodeKindEnum.PhoneNumber);
    expect(entity.customerReferenceId).toBe(dto.customerReferenceId);
    expect(entity.referenceCode).toBe(dto.referenceCode);
  });

  it('should map entity to dto', () => {
    const dto = mapEntity(entity);
    expect(dto.customerReferenceId).toBe(entity.customerReferenceId);
    expect(dto.referenceCode).toBe(entity.referenceCode);
    expect(dto.codeKind).toBe(entity.codeKind.value);
    expect(dto.createdAt).toBe(entity.createdAt.toISOString());
    expect(dto.updatedAt).toBe(entity.updatedAt.toISOString());
    expect(dto.id).toBe(entity.id);
  });
});
