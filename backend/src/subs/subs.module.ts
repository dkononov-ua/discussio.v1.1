import { Module } from '@nestjs/common';
import { SubsController } from './subs.controller';
import { SubsService } from './subs.service';
import { AppService } from 'src/app.service';
import { Service } from './service';


@Module({
  controllers: [SubsController],
  providers: [SubsService, AppService, Service]
})
export class SubsModule {}
