import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AppService } from "src/app.service";
import { Service } from './service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, AppService, Service]
})
export class ChatModule {}
