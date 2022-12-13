import { v4 as uuid } from 'uuid';

export type KycId = string;

export abstract class Kyc {
  static generateId(): string {
    return uuid();
  }
  abstract readonly customerReferenceId: string;
  abstract readonly kind: string;
  abstract readonly id: KycId;
  abstract readonly createdAt: Date;
  abstract readonly updatedAt: Date;
}
