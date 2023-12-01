import { Module } from "@nestjs/common";
import { FlatinfoController } from "./flatinfo.controller";
import { FlatinfoService } from "./flatinfo.service";
import { AppService } from "src/app.service";
import { Service } from "./service";

@Module({
  controllers: [FlatinfoController],
  providers: [FlatinfoService, AppService, Service],
})
export class FlatinfoModule {}
