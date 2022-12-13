export interface HttpResponse {
  statusCode: number;
}

export interface RequestOptions {
  headers?: {
    [key: string]: string | number | boolean;
  };
}

export abstract class HttpClient {
  post: <T>(
    uri: string,
    data: T,
    options?: RequestOptions,
  ) => Promise<HttpResponse>;
}
