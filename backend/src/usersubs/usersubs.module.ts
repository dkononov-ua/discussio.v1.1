import { Module } from '@nestjs/common';
import { UsersubsController } from './usersubs.controller';
import { UsersubsService } from './usersubs.service';
import { AppService } from 'src/app.service';
import { Service } from './service';



@Module({
  controllers: [UsersubsController],
  providers: [UsersubsService, AppService, Service]
})
export class UsersubsModule {}
