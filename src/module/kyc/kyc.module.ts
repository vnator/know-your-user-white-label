import { Module } from '@nestjs/common';
import { AdapterModule } from 'src/adapter/adapter.module';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycAnsweredListener } from './listener/kyc-answered.listener';

@Module({
  imports: [AdapterModule],
  controllers: [KycController],
  providers: [KycService, KycAnsweredListener],
})
export class KycModule {}
