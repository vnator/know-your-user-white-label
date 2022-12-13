import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';
import { HttpExceptionFilter } from './http-exception.filter';

jest.mock('@nestjs/common/services/logger.service');

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let host: ExecutionContext;
  let hostMock: ExecutionContext;
  let adapter: AbstractHttpAdapter;
  let adapterMock: AbstractHttpAdapter;
  let logger: Logger;
  let loggerMock: Logger;

  beforeEach(async () => {
    loggerMock = mock(Logger);
    logger = instance(loggerMock);
    adapterMock = mock<AbstractHttpAdapter>();
    adapter = instance(adapterMock);
    when(adapterMock.reply(anything(), anything(), anything())).thenReturn({});
    filter = new HttpExceptionFilter(adapter, logger);
    hostMock = mock<ExecutionContext>();
    host = instance(hostMock);
  });

  it('should log http erros', async () => {
    const statusCode = HttpStatus.BAD_REQUEST;
    const exception = new HttpException('test', statusCode);
    await filter.catch(exception, host);
    verify(
      adapterMock.reply(
        null,
        deepEqual({
          statusCode,
          message: exception.message,
        }),
        statusCode,
      ),
    ).once();
    verify(loggerMock.error(deepEqual(exception))).once();
  });

  it('should do nothing on common errors', async () => {
    const exception = new Error('test');
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    await filter.catch(exception, host);
    verify(
      adapterMock.reply(
        null,
        deepEqual({
          message: 'Internal server error',
          statusCode,
        }),
        statusCode,
      ),
    ).once();
    verify(loggerMock.error(anything(), anything())).never();
  });

  it('should use default logger', async () => {
    filter = new HttpExceptionFilter(adapter);
    const statusCode = HttpStatus.BAD_REQUEST;
    const exception = new HttpException('test', statusCode);
    await filter.catch(exception, host);
    verify(
      adapterMock.reply(
        null,
        deepEqual({
          statusCode,
          message: exception.message,
        }),
        statusCode,
      ),
    ).once();
    verify(loggerMock.error(anything(), anything())).never();
  });
});
