import { faker } from '@faker-js/faker';
import { Referral } from 'src/module/kyc/entity/referral';
import { referralChoicesFaker } from './referral.dto.mock';

export const referralFaker = () => {
  const instance = new Referral(faker.datatype.uuid(), referralChoicesFaker());
  return instance;
};
