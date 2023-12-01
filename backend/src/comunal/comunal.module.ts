import { Module } from '@nestjs/common';
import { ComunalController } from './comunal.controller';
import { ComunalService } from './comunal.service';
import { AppService } from 'src/app.service';
import { Service } from './service';


@Module({
  controllers: [ComunalController],
  providers: [ComunalService, AppService, Service]
})
export class ComunalModule {}
