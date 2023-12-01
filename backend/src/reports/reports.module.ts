import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Service } from './service';
import { AppService } from 'src/app.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, Service, AppService]
})
export class ReportsModule {}
