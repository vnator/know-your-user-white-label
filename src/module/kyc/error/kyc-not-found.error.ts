import { CustomError } from 'src/shared/custom-error.error';

export class KycNotFound extends CustomError {
  public code = 'KYC_NOT_FOUND';
  public message = 'Kyc not found';
}
