import {
  PlanPreferenceDto,
  CreatePlanPreferenceDto,
} from '../dto/plan-preference.dto';
import { PlanPreference } from '../entity/plan-preference';

export const mapDto = (dto: CreatePlanPreferenceDto): PlanPreference => {
  const { customerReferenceId, data } = dto;

  return new PlanPreference(customerReferenceId, data);
};

export const mapEntity = (entity: PlanPreference): PlanPreferenceDto => {
  const { id, customerReferenceId, createdAt, updatedAt, choices } = entity;
  return {
    id,
    customerReferenceId,
    data: choices,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
