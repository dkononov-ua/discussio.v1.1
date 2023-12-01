import { Controller, Post, Response, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Post("user")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getUserinfo(@Response() res, @Body() tok: Object): Promise<any> {
      await this.reportsService.ReportUser(tok, res);
    }


    @Post('flat')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getAgentinfo(@Response() res, @Body() tok: Object): Promise<any> {
      await this.reportsService.ReportFlat(tok, res);
    }


}
