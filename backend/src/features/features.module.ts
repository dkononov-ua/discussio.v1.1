import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { AppService } from 'src/app.service';
import { Service } from './service';

@Module({
  controllers: [FeaturesController],
  providers: [FeaturesService, AppService, Service]
})
export class FeaturesModule {}
