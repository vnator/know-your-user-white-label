import {
  CreateMemberGetMemberDto,
  MemberGetMemberDto,
} from '../dto/member-get-member.dto';
import { MemberGetMember } from '../entity/member-get-member';
import { MgmCodeKindEnum } from '../entity/mgm-code-kind-enum';

export const mapDto = (dto: CreateMemberGetMemberDto): MemberGetMember => {
  const { customerReferenceId, referenceCode, codeKind } = dto;
  const entity = new MemberGetMember(
    customerReferenceId,
    referenceCode,
    MgmCodeKindEnum.getFromValue(codeKind),
  );
  return entity;
};

export const mapEntity = (entity: MemberGetMember): MemberGetMemberDto => {
  const {
    id,
    customerReferenceId,
    referenceCode,
    codeKind,
    createdAt,
    updatedAt,
  } = entity;
  return {
    id,
    customerReferenceId,
    referenceCode,
    codeKind: codeKind.value,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
