import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { ReferralChoiceEnum } from '../entity/referral';

class ReferralChoice {
  @IsEnum(ReferralChoiceEnum)
  @IsNotEmpty()
  key: ReferralChoiceEnum;
  @IsBoolean()
  @IsDefined()
  value: boolean;
}

export class ReferralDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  customerReferenceId: string;
  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  @Type(() => ReferralChoice)
  data: ReferralChoice[];
  @IsDateString()
  createdAt: string;
  @IsDateString()
  updatedAt: string;
}

export class CreateReferralDto extends OmitType(ReferralDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
