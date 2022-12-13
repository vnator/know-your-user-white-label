import { CreateReferralDto, ReferralDto } from '../dto/referral.dto';
import { Referral } from '../entity/referral';

export const mapDto = (dto: CreateReferralDto): Referral => {
  const { customerReferenceId, data } = dto;
  const entity = new Referral(customerReferenceId, data);
  return entity;
};

export const mapEntity = (entity: Referral): ReferralDto => {
  const { id, customerReferenceId, choices, createdAt, updatedAt } = entity;
  return {
    id,
    customerReferenceId,
    data: choices,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
