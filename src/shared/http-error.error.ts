import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './custom-error.error';

export class CustomHttpError extends HttpException implements CustomError {
  public code: string;
  constructor(error: CustomError, statusCode = HttpStatus.BAD_REQUEST) {
    super({ code: error.code, message: error.message, statusCode }, statusCode);
    this.code = error.code;
    this.message = error.message;
    this.stack = error.stack;
  }
}
