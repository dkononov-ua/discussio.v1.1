/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AcceptSubsController } from './acceptsubs.controller';
import { AcceptSubsService } from './acceptsubs.service';
import { AppService } from 'src/app.service';
import { Service } from './service';

@Module({
  controllers: [AcceptSubsController],
  providers: [AcceptSubsService, AppService, Service]
})
export class AcceptSubsModule {}
