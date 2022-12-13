import { IncomingMessage, ServerResponse } from 'http';

export const genReqId = (req: IncomingMessage) => req.id;
export const getTransport = (prettyLogs: boolean, target: string) =>
  prettyLogs
    ? {
        target,
        options: {
          colorize: true,
        },
      }
    : undefined;

export const customLogLevel = (
  req: IncomingMessage,
  res: ServerResponse,
  err: Error,
) => {
  if (res.statusCode >= 400 && res.statusCode < 500) {
    return 'warn';
  } else if (res.statusCode >= 500 || err) {
    return 'error';
  } else if (res.statusCode >= 300 && res.statusCode < 400) {
    return 'silent';
  }
  return 'info';
};

export const customSuccessMessage = (
  req: IncomingMessage,
  res: ServerResponse,
) =>
  `request [${res.req.method}] - ${res.req.url} completed with status: ${res.statusCode}`;

export const ignore = (req: IncomingMessage) => req.url === '/';
