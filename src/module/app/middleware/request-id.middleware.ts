import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

export const requestId =
  ({ reqHeader = 'Request-Id' } = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.id = req.get(reqHeader) || uuid();
    res.setHeader(reqHeader, req.id);
    next();
  };
