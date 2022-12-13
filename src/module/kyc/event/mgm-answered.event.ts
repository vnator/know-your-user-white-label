import { KycId } from '../entity/kyc';
import { MemberGetMember } from '../entity/member-get-member';
import { KycAnsweredEvent } from './kyc-answered.event';
import { EventEnum } from './kyc-event.enum';

export class MgmAnsweredEvent extends KycAnsweredEvent<MemberGetMember> {
  constructor(id: KycId, data: MemberGetMember) {
    super(id, data, EventEnum.KYC_MGM_ANSWERED);
  }
}
