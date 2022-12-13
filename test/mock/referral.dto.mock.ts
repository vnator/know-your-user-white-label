import { faker } from '@faker-js/faker';
import {
  CreateReferralDto,
  ReferralDto,
} from 'src/module/kyc/dto/referral.dto';
import { ReferralChoiceEnum } from 'src/module/kyc/entity/referral';

export const referralChoicesFaker = () =>
  Object.values(ReferralChoiceEnum).map((choice) => ({
    key: choice,
    value: faker.datatype.boolean(),
  }));

export const createReferralDtoFaker = () => {
  const instance = new CreateReferralDto();
  instance.customerReferenceId = faker.datatype.uuid();
  instance.data = referralChoicesFaker();
  return instance;
};
export const referralDtoFaker = () => {
  const instance = new ReferralDto();
  instance.customerReferenceId = faker.datatype.uuid();
  instance.data = referralChoicesFaker();
  instance.id = faker.datatype.uuid();
  instance.createdAt = faker.date.past().toISOString();
  instance.updatedAt = faker.date.past().toISOString();
  return instance;
};
