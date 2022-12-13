import { Kyc } from './kyc';

export class KycChoice {
  key: string;
  value: boolean;
}

export abstract class KycChoices<T extends KycChoice> extends Kyc {
  abstract choices: T[];
}
