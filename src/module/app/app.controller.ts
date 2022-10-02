import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { name, version } from '../../../package.json';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

abstract class AppInfo {
  name: string;
  version: string;
}

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  async healthCheck(): Promise<AppInfo> {
    await this.appService.healthCheck();
    return { name, version };
  }
}
