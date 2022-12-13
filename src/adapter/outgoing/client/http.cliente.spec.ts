import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { HttpClient } from './http.client';

describe('http.client', () => {
  let httpClient: HttpClient;
  let httpService: HttpService;
  let httpServiceMock: HttpService;
  beforeEach(() => {
    httpServiceMock = mock(HttpService);
    when(httpServiceMock.post(anything(), anything(), anything())).thenResolve(
      of({
        status: 200,
      }) as any,
    );
    httpService = instance(httpServiceMock);
    httpClient = new HttpClient(httpService);
  });
  it('should be defined', () => {
    expect(httpClient).toBeDefined();
  });

  describe('post', () => {
    it('should call httpService.post', async () => {
      const url = 'http://foo.bar';
      const data = { foo: 'bar' };
      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const responde = await httpClient.post(url, data, options);
      verify(httpServiceMock.post(url, data, options)).once();
      expect(responde).toEqual({
        statusCode: 200,
      });
    });
  });
});
