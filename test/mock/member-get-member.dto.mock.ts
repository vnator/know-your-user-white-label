import { faker } from '@faker-js/faker';
import {
  CreateMemberGetMemberDto,
  MemberGetMemberDto,
} from 'src/module/kyc/dto/member-get-member.dto';
import { MgmCodeKindValues } from 'src/module/kyc/entity/mgm-code-kind-enum';

export const createMemberGetMemberDtoFaker = () => {
  const codeKind = () =>
    faker.helpers.arrayElement<MgmCodeKindValues>(
      Object.values(MgmCodeKindValues),
    );
  const instance = new CreateMemberGetMemberDto();
  instance.customerReferenceId = faker.datatype.uuid();
  instance.referenceCode = faker.phone.number();
  instance.codeKind = codeKind();
  return instance;
};
export const memberGetMemberDtoFaker = () => {
  const codeKind = () =>
    faker.helpers.arrayElement<MgmCodeKindValues>(
      Object.values(MgmCodeKindValues),
    );
  const instance = new MemberGetMemberDto();
  instance.customerReferenceId = faker.datatype.uuid();
  instance.referenceCode = faker.phone.number();
  instance.codeKind = codeKind();
  instance.id = faker.datatype.uuid();
  instance.createdAt = faker.date.past().toISOString();
  instance.updatedAt = faker.date.past().toISOString();
  return instance;
};
