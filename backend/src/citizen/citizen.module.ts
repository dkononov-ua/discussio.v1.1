import { Module } from "@nestjs/common";
import { CitizenController } from "./citizen.controller";
import { CitizenService } from "./citizen.service";
import { AppService } from "src/app.service";
import { Service } from "./service";

@Module({
  controllers: [CitizenController],
  providers: [CitizenService, AppService, Service],
})
export class CitizenModule {}
