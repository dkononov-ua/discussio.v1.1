/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { AppService } from 'src/app.service';
import { Service } from './service';


@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, AppService, Service]
})
export class FeedbackModule {}
