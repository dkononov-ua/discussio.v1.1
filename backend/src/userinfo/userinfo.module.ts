import { Module } from '@nestjs/common';
import { UserinfoController } from './userinfo.controller';
import { UserinfoService } from './userinfo.service';
import { AddModule } from './add/add.module';
import { AppService } from 'src/app.service';
import { Service } from './service';


@Module({
  controllers: [UserinfoController],
  providers: [UserinfoService, AppService, Service],
  imports: [AddModule]
})
export class UserinfoModule {}
