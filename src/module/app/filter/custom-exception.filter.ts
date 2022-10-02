import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { CustomError } from 'src/shared/custom-error.error';
import { CustomHttpError } from 'src/shared/http-error.error';

@Catch()
export class CustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof CustomError) {
      const httpError = new CustomHttpError(exception);
      super.catch(httpError, host);
      return;
    }
    super.catch(exception, host);
  }
}
