import { Kyc } from './kyc';
import { MgmCodeKindEnum } from './mgm-code-kind-enum';

export class MemberGetMember extends Kyc {
  static readonly kind = 'MEMBER_GET_MEMBER';
  public readonly kind = MemberGetMember.kind;
  constructor(
    readonly customerReferenceId: string,
    readonly referenceCode: string,
    readonly codeKind: MgmCodeKindEnum,
    readonly id = Kyc.generateId(),
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date(),
  ) {
    super();
  }
}
