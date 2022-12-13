import { fake } from 'test/mock';
import { PlanPreference } from './plan-preference';

describe('PlanPreferenceEntity', () => {
  let entity: PlanPreference;
  let falsyChoices;

  beforeEach(() => {
    entity = fake(PlanPreference);
    falsyChoices = entity.choices.map((key) => ({ key, value: false }));
  });

  it('should generate id', () => {
    const mgm = new PlanPreference('', falsyChoices);
    expect(mgm.id).toBeDefined();
  });

  it('should have kyc kind', () => {
    const mgm = new PlanPreference('', falsyChoices);
    expect(mgm.kind).toEqual('PLAN_PREFERENCE');
  });
});
