import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  HttpClient as HttpClientPort,
  HttpResponse,
  RequestOptions,
} from 'src/adapter/port/http-client';

@Injectable()
export class HttpClient implements HttpClientPort {
  constructor(private readonly httpService: HttpService) {}
  async post(
    url: string,
    data: any,
    options?: RequestOptions,
  ): Promise<HttpResponse> {
    const responseObservable = await this.httpService.post(url, data, options);
    const response = await lastValueFrom(responseObservable);
    return {
      statusCode: response.status,
    };
  }
}

export const HttpClientProvider = {
  provide: HttpClientPort,
  useClass: HttpClient,
};
