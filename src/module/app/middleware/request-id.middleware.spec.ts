import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import { requestId } from './request-id.middleware';
import { instance, mock, verify, when } from 'ts-mockito';

describe('RequestIdMiddleware', () => {
  let reqHeader: string;
  let req: Request;
  let reqMock: Request;
  let res: Response;
  let resMock: Response;
  let next: NextFunction;

  beforeEach(() => {
    reqMock = mock<Request>();
    req = instance(reqMock);
    resMock = mock<Response>();
    res = instance(resMock);
    next = jest.fn();
    reqHeader = faker.datatype.string();
    req.id = undefined;
  });

  it('should create a request id', () => {
    requestId({ reqHeader })(req, res, next);
    expect(req.id).toBeDefined();
    verify(reqMock.get(reqHeader)).once();
    verify(resMock.setHeader(reqHeader, `${req.id}`)).once();
  });

  it('should use an existing request id', () => {
    const existentRequestId = faker.datatype.uuid();
    when(reqMock.get(reqHeader)).thenReturn(existentRequestId);
    requestId({ reqHeader })(req, res, next);
    expect(req.id).toBe(existentRequestId);
  });

  it('should use default request id header name', () => {
    requestId()(req, res, next);
    verify(resMock.setHeader('Request-Id', `${req.id}`)).once();
  });
});
