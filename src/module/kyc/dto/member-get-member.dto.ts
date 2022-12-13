import { OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { MgmCodeKindValues } from '../entity/mgm-code-kind-enum';

export class MemberGetMemberDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  customerReferenceId: string;
  @IsString()
  @IsNotEmpty()
  referenceCode: string;
  @IsEnum(MgmCodeKindValues)
  codeKind: MgmCodeKindValues;
  @IsDateString()
  createdAt: string;
  @IsDateString()
  updatedAt: string;
}

export class CreateMemberGetMemberDto extends OmitType(MemberGetMemberDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
