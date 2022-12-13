import { fake } from 'test/mock';
import { Referral } from './referral';

describe('ReferralEntity', () => {
  let entity: Referral;
  let falsyChoices;

  beforeEach(() => {
    entity = fake(Referral);
    falsyChoices = entity.choices.map((key) => ({ key, value: false }));
  });

  it('should generate id', () => {
    const mgm = new Referral('', falsyChoices);
    expect(mgm.id).toBeDefined();
  });

  it('should have kyc kind', () => {
    const mgm = new Referral('', falsyChoices);
    expect(mgm.kind).toEqual('REFERRAL');
  });
});
