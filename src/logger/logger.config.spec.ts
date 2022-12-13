import { faker } from '@faker-js/faker';
import { ServerResponse } from 'http';
import { IncomingMessage } from 'http';
import {
  customLogLevel,
  customSuccessMessage,
  genReqId,
  getTransport,
  ignore,
} from './logger.config';

describe('Logger Config', () => {
  let prettyLogs: boolean;
  let req: IncomingMessage;

  beforeEach(() => {
    req = {
      method: faker.datatype.string(),
      url: faker.internet.url(),
    } as IncomingMessage;
  });

  describe('getTransport', () => {
    it('should return transport when prettyLogs = true', () => {
      prettyLogs = true;
      const transport = getTransport(prettyLogs, faker.datatype.string());
      expect(transport).toBeDefined();
    });

    it('should return undefined when prettyLogs = false', () => {
      prettyLogs = false;
      const transport = getTransport(prettyLogs, faker.datatype.string());
      expect(transport).toBeUndefined();
    });
  });

  describe('generate request id', () => {
    it('should return request id', () => {
      const reqId = genReqId(req);
      expect(reqId).toBe(req.id);
    });
  });

  describe('custom log level', () => {
    it('should return custom log level', () => {
      const res = {
        statusCode: faker.datatype.number(),
      } as ServerResponse;
      const err = new Error(faker.lorem.sentence());
      const logLevel = customLogLevel(req, res, err);
      expect(logLevel).toBeDefined();
    });

    it('should return silent when statusCode >= 300 and < 400', () => {
      const res = {
        statusCode: faker.datatype.number({ min: 300, max: 399 }),
      } as ServerResponse;
      const logLevel = customLogLevel(req, res, null);
      expect(logLevel).toBe('silent');
    });

    it('should return warn when statusCode >= 400 and < 500', () => {
      const res = {
        statusCode: faker.datatype.number({ min: 400, max: 499 }),
      } as ServerResponse;
      const logLevel = customLogLevel(req, res, null);
      expect(logLevel).toBe('warn');
    });

    it('should return error when statusCode >= 500', () => {
      const res = {
        statusCode: faker.datatype.number({ min: 500 }),
      } as ServerResponse;
      const logLevel = customLogLevel(req, res, null);
      expect(logLevel).toBe('error');
    });

    it('should return error when error is not null', () => {
      const res = {
        statusCode: faker.datatype.number(),
      } as ServerResponse;
      const err = new Error(faker.lorem.sentence());
      const logLevel = customLogLevel(req, res, err);
      expect(logLevel).toBe('error');
    });

    it('should return info when statusCode < 300', () => {
      const res = {
        statusCode: faker.datatype.number({ min: 100, max: 299 }),
      } as ServerResponse;
      const logLevel = customLogLevel(req, res, null);
      expect(logLevel).toBe('info');
    });
  });

  describe('custom success message', () => {
    it('should return custom success message', () => {
      const res = {
        statusCode: faker.datatype.number(),
        req: {
          method: faker.datatype.string(),
          url: faker.internet.url(),
        },
      } as ServerResponse;
      const successMessage = customSuccessMessage(req, res);
      expect(successMessage).toBeDefined();
    });
  });

  describe('ignore health check', () => {
    it('should ignore health check', () => {
      req.url = '/';
      const shouldIgnore = ignore(req);
      expect(shouldIgnore).toBeTruthy();
    });
    it('should not ignore health check', () => {
      const shouldIgnore = ignore(req);
      expect(shouldIgnore).toBeFalsy();
    });
  });
});
