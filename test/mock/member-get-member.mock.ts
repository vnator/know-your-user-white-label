import { faker } from '@faker-js/faker';
import { MemberGetMember } from 'src/module/kyc/entity/member-get-member';
import {
  MgmCodeKindEnum,
  MgmCodeKindValues,
} from 'src/module/kyc/entity/mgm-code-kind-enum';

export const memberGetMemberFaker = () => {
  const codeKind = () =>
    faker.helpers.arrayElement<MgmCodeKindValues>(
      Object.values(MgmCodeKindValues),
    );
  const instance = new MemberGetMember(
    faker.datatype.uuid(),
    faker.phone.number(),
    MgmCodeKindEnum.getFromValue(codeKind()),
  );
  return instance;
};
