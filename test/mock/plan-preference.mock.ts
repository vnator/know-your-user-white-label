import { faker } from '@faker-js/faker';
import { PlanPreference } from 'src/module/kyc/entity/plan-preference';
import { planPreferenceChoicesFaker } from './plan-preference.dto.mock';

export const planPreferenceFaker = () => {
  const instance = new PlanPreference(
    faker.datatype.uuid(),
    planPreferenceChoicesFaker(),
  );
  return instance;
};
