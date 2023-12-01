import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Service } from './service';
import { AppService } from 'src/app.service';


@Module({
  controllers: [AdminController],
  providers: [AdminService, Service, AppService]
})
export class AdminModule {}
