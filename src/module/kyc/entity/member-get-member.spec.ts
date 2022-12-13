import { fake } from 'test/mock';
import { MemberGetMember } from './member-get-member';

describe('MemberGetMemberEntity', () => {
  let entity: MemberGetMember;
  beforeEach(() => {
    entity = fake(MemberGetMember);
  });

  it('should generate id', () => {
    expect(entity.id).toBeDefined();
  });

  it('should have kyc kind', () => {
    expect(entity.kind).toEqual('MEMBER_GET_MEMBER');
  });
});
