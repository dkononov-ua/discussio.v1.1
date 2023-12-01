import { Module } from '@nestjs/common';
import { AgreementController } from './agreement.controller';
import { AgreementService } from './agreement.service';
import { AppService } from 'src/app.service';
import { Service } from './service';


@Module({
  controllers: [AgreementController],
  providers: [AgreementService, AppService, Service]
})
export class AgreementModule {}
