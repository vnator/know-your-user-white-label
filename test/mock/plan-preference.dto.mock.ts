import { faker } from '@faker-js/faker';
import {
  CreatePlanPreferenceDto,
  PlanPreferenceDto,
} from 'src/module/kyc/dto/plan-preference.dto';
import { PlanPreferenceChoiceEnum } from 'src/module/kyc/entity/plan-preference';

export const planPreferenceChoicesFaker = () =>
  Object.values(PlanPreferenceChoiceEnum).map((choice) => ({
    key: choice,
    value: faker.datatype.boolean(),
  }));

export const createPlanPreferenceDtoFaker = () => {
  const instance = new CreatePlanPreferenceDto();
  instance.customerReferenceId = faker.datatype.uuid();
  instance.data = planPreferenceChoicesFaker();
  return instance;
};

export const planPreferenceDtoFaker = () => {
  const instance = new PlanPreferenceDto();
  instance.customerReferenceId = faker.datatype.uuid();
  instance.data = planPreferenceChoicesFaker();
  instance.id = faker.datatype.uuid();
  instance.createdAt = faker.date.past().toISOString();
  instance.updatedAt = faker.date.past().toISOString();
  return instance;
};
