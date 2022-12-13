import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PlanPreferenceChoiceEnum } from '../entity/plan-preference';

class PlanPreferenceChoice {
  @IsEnum(PlanPreferenceChoiceEnum)
  @IsNotEmpty()
  key: PlanPreferenceChoiceEnum;
  @IsBoolean()
  @IsDefined()
  value: boolean;
}
export class PlanPreferenceDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  customerReferenceId: string;
  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  @Type(() => PlanPreferenceChoice)
  data: PlanPreferenceChoice[];
  @IsDateString()
  createdAt: string;
  @IsDateString()
  updatedAt: string;
}

export class CreatePlanPreferenceDto extends OmitType(PlanPreferenceDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
