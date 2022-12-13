import { EnumClass } from 'src/shared/enum-class';

export enum MgmCodeKindValues {
  PhoneNumber = 'PHONE_NUMBER',
}

export class MgmCodeKindEnum extends EnumClass<MgmCodeKindValues> {
  static readonly PhoneNumber = new MgmCodeKindEnum(
    MgmCodeKindValues.PhoneNumber,
  );
}
