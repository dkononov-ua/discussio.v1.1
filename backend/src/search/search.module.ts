import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { AppService } from 'src/app.service';
import { Service } from './service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, AppService, Service]
})
export class SearchModule {}
