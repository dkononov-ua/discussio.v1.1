import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { AppService } from 'src/app.service';
import { Service } from './service';

@Module({
  controllers: [RatingController],
  providers: [RatingService, AppService, Service]
})
export class RatingModule {}
