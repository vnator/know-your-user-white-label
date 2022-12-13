import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpServer,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(
    applicationRef?: HttpServer,
    private logger: Logger = new Logger('HttpExceptionFilter'),
  ) {
    super(applicationRef);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      this.logger.error(exception);
    }
    super.catch(exception, host);
  }
}
