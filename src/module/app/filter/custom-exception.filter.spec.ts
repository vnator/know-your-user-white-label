import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { CustomError } from 'src/shared/custom-error.error';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';
import { CustomExceptionFilter } from './custom-exception.filter';

describe('CustomExceptionFilter', () => {
  let filter: CustomExceptionFilter;
  let host: ExecutionContext;
  let hostMock: ExecutionContext;
  let adapter: AbstractHttpAdapter;
  let adapterMock: AbstractHttpAdapter;

  class MyError extends CustomError {
    public code = 'MY_ERROR';
  }

  beforeEach(async () => {
    adapterMock = mock<AbstractHttpAdapter>();
    adapter = instance(adapterMock);
    when(adapterMock.reply(anything(), anything(), anything())).thenReturn({});
    filter = new CustomExceptionFilter(adapter);
    hostMock = mock<ExecutionContext>();
    host = instance(hostMock);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should convert custom exception in http exception with code', async () => {
    const exception = new MyError('test');
    const statusCode = HttpStatus.BAD_REQUEST;
    await filter.catch(exception, host);
    verify(
      adapterMock.reply(
        null,
        deepEqual({
          code: exception.code,
          message: exception.message,
          statusCode,
        }),
        statusCode,
      ),
    ).once();
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
  });
});
